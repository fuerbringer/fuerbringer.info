let
  expressPort = 3000;
in
{
  network.description = "Personal Site by Severin Fürbringer";

  node-server =
    { stdenv, config, pkgs, ... }:
    let
      webAppContent = import ./application.nix;
    in
    {
      environment.systemPackages =
      [ webAppContent
        pkgs.nodejs-8_x
      ];

      networking.firewall.allowedTCPPorts = [ expressPort ]; 

      systemd.services.node-server =
      { description = "fuerbringer.info node server";
        requires = [ "network.target" ];
        wantedBy = [ "multi-user.target" ];
        environment = { PORT = toString expressPort; };
        path = [ "${webAppContent}/web/" ];
        serviceConfig =
        { Restart = "always";
          ExecStart = "${pkgs.nodejs-8_x}/bin/node ${webAppContent}/web/keystone.js";
        };
      };
    };
}
