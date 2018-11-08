---
title: Deploying Node apps with Docker and Jenkins
author: Severin Fürbringer
description: Deploying Node apps with Docker and Jenkins
---

# Deploying dockerized Node applications using Jenkins

In this short tutorial we outline the steps needed to deploy dockerized applications from a Git repository to a server running Jenkins.

## Environment

The following environment is assumed.

- GNU/Linux Server*
- Running Docker daemon 
- Jenkins with _GitHub Plugin_ and _post-build_ action triggers installed
- Dockerized web application with _Dockerfile_ present
- _Public_ GitHub repository
- Jenkins and Docker are running on the same host

\* I'm using [NixOS](https://nixos.org/nixos/nix-pills/). A declarative and reliable operating system where it happens to be stupidly simple to quickly set up [Docker](https://github.com/fuerbringer/nixfiles/blob/8b635480c1fadc199f7bb9ce8fe69f7faa3fda1e/orbit/configuration.nix#L49) and Jenkins.

## Process

With all things ready we're going to establish the following automated procedure.

1. Jenkins detects PUSH to GitHub repository (_master_ branch)
2. Jenkins pulls changes locally
3. Jenkins builds application and a fresh docker container
4. Jenkins aborts should a build fail
5. Jenkins runs docker container with the newest changes
6. Reverse Proxy of your choice forwards traffic to LAN or WAN

## Deployment

### Jenkins settings

Log into Jenkins and create a _Freestyle Project_ as you'd do with any other application. For our usecase there's a couple of fields which _need_ to be populated.

1. _General / GitHub / Project url_ with your GitHub HTTP repo url
2. _Source Code Management / Git_ same as above with the branch set to _*/master_
3. _Build Triggers / GitHub hook trigger for GITScm polling_ activated
4. _Build / Execute shell_ with _docker build -t YOURCONTAINER ._
5. _Post-build Actions_ with the following settings:
  - _Log text_ which looks for the success message in STDOUT, like _Successfully built_
  - _Script_ which removes the _YOURCONTAINER_ container and redeploys the new container image:
    ```
    docker rm -f YOURCONTAINER || true
    docker run -d --net=host --name YOURCONTAINER YOURCONTAINER
    ```
  - Enable _Run script only if all previous steps were successful_ to ensure failed builds do not get deployed (Optional).

Assuming the rest of your Jenkins installation is set up correctly this should suffice so far.

### GitHub settings

Now GitHub has to let our Jenkins instance know when something's been pushed to _master_. Luckily Jenkins integration is available as a ready to use service for your repository. Navigate to _Settings / Integrations & services_ in your repository and select _Jenkins (GitHub plugin)_. The _Jenkins hook url_ should be the same as defined in Jenkins:

- _Manage Jenkins / Configure System / Jenkins URL_ with something like _https://ci.example.com/github-webhook/_

Should be everything! Now once something gets pushed into master your Jenkins will be called and the build and deploy process executed.
