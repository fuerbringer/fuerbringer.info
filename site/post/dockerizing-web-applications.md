The traditional way of serving web applications was to place them in a web root directory, adjust the web server configs and be done with it. In some cases, control panels like Plesk were used to handle that kind of work if you lacked the technical background or just didn't have the time to adjust all the config files.

## The problems with traditional web hosting
There's a couple problems I have with control panels like Plesk or VestaCP:
1. They bloat up your server with packages you might not even need.
2. They may introduce additional attack surfaces (see pt. 1).
3. They lack flexibility in certain situations.
4. Panels like Plesk are [proprietary software](https://www.gnu.org/philosophy/free-software-even-more-important.html) and should therefore not be used.

## The solution
### Dockerizing your application
Using Docker to containerize your web application solves all the above mentioned problems as long _as you know your way around a SSH terminal_:

1. The dependencies of your applications are containerized and do not have any effect on your base root system.
2. A Docker container introduces an extra layer of security. A compromised container will in most cases not be able to harm the host system.
3. Docker gives you ultimate flexibility. It even makes it easy to run multiple versions and instances of the same application side by side!
4. Docker is [Free Software](https://www.gnu.org/philosophy/free-sw.html).

### How does it work?
The simplest way of explaining Docker is to imagine it as a virtual machine (or a container). Your app runs inside that container and gets its own virtual network device and IP address. All dependencies your application requires are bundled inside of that container. Your web server of choice (like Nginx) is then used as a reverse proxy to expose your app to the world on your servers public IP address as a virtual host.

Here's a more visual example on how it all fits together:

`DB Container (172.18.0.2) <--> App Container (172.18.0.1) --> Nginx (public IP / 89.163.224.131) --> the Internet`

### A Step-by-step guide
Here's the steps to dockerize your web application. The requirement being a Linux server with [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/debian/) and [Nginx](https://nginx.org/) installed.
### Step 0: Docker network
You'll first want to create a Docker network in order to assign static IP addresses to your containers like this:

`docker network create --driver bridge --subnet 172.18.0.0/24 revproxynet`

### Step 1: Database container
If you're running a web application chances are it requires a database. The [Docker Store](https://store.docker.com/images/mongo) almost certainly has a ready to use image for the database software you're using. If you're using MongoDB there's even an official image.

Use the following as an example to install an image from the Docker Store:

`docker run -d --name mysite.com-db --net revproxynet --ip 172.18.0.2 mongo`

Now verify that the container's running properly with the following commands:

1. `docker ps -a` (shouldn't display as "exited")
2. `docker logs mysite.com-db` (shouldn't display anything resembling an error)
3. `docker inspect mysite.com-db` (should have the assigned IP from above)

So far so good. Now you've got a database running at `172.18.0.2`. If you've got any further database configurations you need to get done: Log into the Docker container like this: `docker exec -it mysite.com-db sh`. Think of it as a mix between `chroot` and `ssh`.

### Step 2: Getting your app ready for Docker
Dockerizing your web app (in most cases) is a matter of creating a couple configuration files inside of your apps root directory.

The first file you'll want to create is the [Dockerfile](https://www.digitalocean.com/community/tutorials/docker-explained-using-dockerfiles-to-automate-building-of-images) (`vim Dockerfile`). The following example is already enough to get a KeystoneJS Node app ready for Docker:
```
FROM node:7.10
ADD run.sh run.sh
EXPOSE 3000
ENV PORT 3000
CMD ["start"]
ENTRYPOINT ["./run.sh"]
```

Depending on the framework you're using you're going to have to specify the databse link (for which the need will become obvious in step 3). Here's an example for KeystoneJS, the `.env` file:
```
MONGO_URI=mongodb://admin@mongo:27017
```
Ofcourse `mongo` basically being the hostname of our already instantiated database container running at `172.18.0.2`.

The above settings will likely need to be adjusted according to your needs and framework.

### Step 3: Building and running your Dockerized web app

If everything went well so far you'll want to build your finished app:
```
docker build -t your-name/repo-name .
```
The above command expects you to be in your repos root directory. This command might take some time.

And now we're ready for launch:

```
docker run -d --name mysite.com --net revproxynet --ip 172.18.0.1 --link mysite.com-db:mongo -v "$PWD":/usr/src/app -w /usr/src/app repo-name
```

The above command links your database container with the web app container and executes `npm start` inside the container (depending on your Dockerfile).

Once that's done, verify your container using the usual commands: `docker ps -a && docker inspect mysite.com && docker logs mysite.com`

Again, if you need to do any manual adjustments inside a Docker container: `docker exec -it mysite.com sh` to get a shell inside the container.

### Step 4: Exposing your app on the internet
Whew, now you've (hopefully) got your app running locally on `172.18.0.1:3000`, or whatever host and port you defined earlier. The only thing left to do is to use a reverse proxy like Nginx to make your creation public!

If you haven't already, install nginx: `apt install nginx` (this will differ depending on your OS).

Now create a vhost file like this: `/etc/nginx/sites-available/mysite.com`
```
 server {
   listen 443 http2 ssl;
   listen [::]:443 http2 ssl;
 
   ssl on;
   ssl_certificate /etc/letsencrypt/live/mysite.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/mysite.com/privkey.pem;
 
   server_name mysite.com;
 
   location / {
     proxy_pass         http://172.18.0.1:3000;
     proxy_redirect     off;
     proxy_set_header   Host $host;
     proxy_set_header   X-Real-IP $remote_addr;
     proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header   X-Forwarded-Host $server_name;
   }
}

```

There's alot to explain in the above config file snippet, so let's get to it:
1. `listen` defines on which public port to listen to.
2. The snippet requires you to have a Let's Encrypt certificate.
3. Remove the ssl* lines and change the listen ports to `80` if you do not wish to host a HTTPS site
4. `proxy_pass` is our container!

After saving and exiting we need to enable our vhost like this: `ln -s /etc/nginx/sites-available/mysite.com /etc/nginx/sites-enabled/mysite.com`.

Once that's done, you'll probably want to verify all your Nginx config files (`nginx -t`) and restart the web server (`service nginx restart`).

That's it! If you've followed all the steps your dockerized app should now be running on whatever domain you've defined in your configs earlier.

## An example project
If you need a concrete example of a dockerized web application, take a look at [Tarchivebot](https://github.com/PROGRADE-Tech/Tarchivebot). It's a pure ExpressJS app I've been working on for a while now. In my opinion it's an excellent use case.