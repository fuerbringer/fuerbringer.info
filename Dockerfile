FROM node:8.11.3-alpine
MAINTAINER Severin Fürbringer <severin@fsfe.org>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
