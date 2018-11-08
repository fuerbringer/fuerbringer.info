---
title: Writing Modules for NixOS
author: Severin Fürbringer
description: Modularizing your NixOS configuration files for more reusability.
---

# Declaring Modules for NixOS
## What is Nix and NixOS?
Nix is an excellent declarative package manager which really shines as it appears in NixOS. An operating system which lets you fully declare what your system should look like and builds it according to that. Using its functional dedicated scripting language (DSL) Nix allows for a text based, modular and near infinite amount of possible operating system configurations. Webservers hosting hundreds of vhosts, Tor nodes, desktop workstations, _riced_ i3wm ThinkPad setups, NixOS does not get in the way.
In fact, I'm using NixOS for exactly that. A desktop and laptop configuration all in one. It's available [here](https://github.com/fuerbringer/nixfiles).

_Note: This memo does not describe how to write packages / derivations for Nix._

## Modularity
Imagine you could have the exact same setup across all of your machines with configurable aspects depending on whether the machine is mobile or not. Well, it's probably not hard to imagine, you just have to do it. But doing so might be rather annoying if done manually, or simply a waste of time. Some might immidiately suggest Ansible, and while that would work, I'd argue it's not the best solution for this particular usecase. Let us now have a look at how elagantly NixOS solves this problem.
### configuration.nix
Each machine has a _configuration.nix_ file. It defines the computer's state. It might have something like this in it:

```
services = {
  xserver = {
    enable = true;
    # <desktop manager configuration maybe?>
    windowManager = {
      i3 = {
        enable = true;

      };
      default = "i3";

    };

  };

  compton = {
    enable = true;
  };
};
```

That Nix configuration gets us halfway to a ready to use i3wm desktop. It could almost be _git pull_ed to multiple machines and built! But what do you do if you don't want Compton with fancy effects running on your battery powered laptop? What we'd need is some kind of way to pack the above code into a module, a function if you will, and tell it, as a parameter, whether to be in mobile mode or not.
### Small module example
Let us now take a look at a small NixOS module.

```
{ config, lib, pkgs, ... }:

with lib; 

let
cfg = config.services.myModule;
in {
  options.services = {
    myModule = {
      isMobile = mkOption {
        default = false;
        type = with types; nullOr bool;
        description = "Whether the computer is a mobile device.";

      };

    };

  };

  config = {
    services = {
      xserver = {
        enable = true;
        layout = "us";

        # Use LightDM as display manager
        displayManager.lightdm.enable = true;

        # Enable on mobile for touchpads, etc.
        libinput.enable = cfg.isMobile;

        # Use i3wm with a custom config
        windowManager = {
          i3.enable = true;
          default = "i3";

        };

      };

      compton = {
        enable = !cfg.isMobile;
        extraOptions = ''
          # Fancy expensive effects here!
        '';

      };

    };

  };

}
```

So what do we have here? Think of it as a function we can import and call in our _configuration.nix_ and define whether we want mobile mode (_options.services.myModule.isMobile_) to be enabled. Assuming the above module is saved as _myModule.nix_ it can be imported into a _configuration.nix_ like so:

```
{ config, pkgs, ...   }:
{
  imports = [
    ./myModule.nix
  ];

  services.myModule.isMobile = true;
  # Rest of configuration.nix

}
```

And that's it! Another _configuration.nix_ for your desktop computer with _isMobile_ set to _false_ would disable Compton accordingly. As already mentioned, this allows for near infinite flexibility. With a bit more Nix language knowledge you could go on to dynamically generating differing _/etc_ configuration files depending on the module parameters.

If you need a complete example for this use case take a look at my [nixfiles](https://github.com/fuerbringer/nixfiles)!

## Further reading
- [NixOS Manual, "Chapter 34. Writing NixOS Modules"](https://nixos.org/nixos/manual/index.html#sec-writing-modules)
- [Nix Pills, "Chapter 4. The Basics of the Language"](https://nixos.org/nixos/nix-pills/basics-of-language.html)
