Let's take a look on how to automate the deployment of Dockerized applications using Jenkins!

## Environment

It's assumed that you have following things ready.

- GNU/Linux Server*
- Docker on the server
- Jenkins with `GitHub Plugin` and `post-build` action triggers installed
- Dockerized web application with `Dockerfile` present
- _Public_ GitHub repository
- **Jenkins and Docker are running on the same host**

\* I'm using [NixOS](https://nixos.org/nixos/nix-pills/) as it's a declarative and reliable operating system, where it happens to be stupidly simple to quickly set up [Docker](https://github.com/fuerbringer/nixfiles/blob/8b635480c1fadc199f7bb9ce8fe69f7faa3fda1e/orbit/configuration.nix#L49) and Jenkins.

## Process

With all things ready we're going to establish the following automated procedure.

1. Jenkins detects PUSH to GitHub repository (`master` branch)
2. Jenkins pulls changes locally.
3. Jenkins builds application and a fresh docker container.
4. Jenkins aborts should a build fail.
5. Jenkins runs docker container with the newest changes.
6. Reverse Proxy of your choice forwards traffic to the internet!

## Deployment

### Jenkins settings

Log into Jenkins and create a _Freestyle Project_ as you'd do with any other application. For our usecase there's a couple of fields which _need_ to be populated.

1. `General / GitHub / Project url` with your GitHub HTTP repo url.
2. `Source Code Management / Git` same as above with the branch set to `*/master`.
3. `Build Triggers / GitHub hook trigger for GITScm polling` activated.
4. `Build / Execute shell` with `docker build -t YOURCONTAINER .`
5. `Post-build Actions` with the following settings:
    - `Log text` which looks for the success message in STDOUT, like `Successfully built`.
    - `Script` which removes the `YOURCONTAINER` container and redeploys the new container image:

    ```
    docker rm -f YOURCONTAINER || true
    docker run -d --net=host --name YOURCONTAINER YOURCONTAINER
    ```
    - Enable `Run script only if all previous steps were successful` to ensure failed builds do not get deployed (Optional).


Assuming the rest of your Jenkins installation is set up correctly this should suffice so far.

### GitHub settings

Now GitHub has to let our Jenkins instance know when something's been pushed to `master`. Luckily Jenkins integration is available as a ready to use service for your repository. Navigate to `Settings / Integrations & services` in your repository and select `Jenkins (GitHub plugin)`. The `Jenkins hook url` should be the same as defined in Jenkins:
- `Manage Jenkins / Configure System / Jenkins URL` with something like `https://ci.example.com/github-webhook/`.


Should be everything! Now once something gets pushed into master your Jenkins will be called and the build and deploy process executed.