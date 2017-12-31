FROM node:8.9.3-alpine
MAINTAINER Severin Fürbringer <severin@fsfe.org>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
# Bundle app source
COPY . /usr/src/app

ADD run.sh run.sh
RUN chmod +x run.sh

EXPOSE 3000
CMD [ "npm", "start" ]
