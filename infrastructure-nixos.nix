{
  # TODO figure out deploying to existing NixOS machines...
  node-server =
    { deployment.targetHost = "10.1.1.15";
      deployment.targetPort = 2022;
    };
}
