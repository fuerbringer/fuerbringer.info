I've [previously](/post/managing-shell-scripts-on-nixos.html) discussed how to
package your own scripts into the NixOS system by using `mkDerivation`. Since
then I've discovered a much more convenient way NixOS allows you to package
shell scripts. The
[`pkgs.writeScriptBin`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/trivial-builders.nix#L58)
function allows you to easily generate Nix packages in your `configuration.nix`
by passing it the shell script name and text contents:

```
myscript = pkgs.writeScriptBin "myscript" ''
    #!${pkgs.stdenv.shell}
    echo "Hello, world! This is my shell script."
  '';
```

In this context, `myscript` will be a package which we can add to our `environment.systemPackages` like so:

```
let
  myscript = pkgs.writeScriptBin "myscript" ''
      #!${pkgs.stdenv.shell}
      echo "Hello, world! This is my shell script."
    '';
in
{
  # Your usual configuration.nix
  # ...
  environment.systemPackages = with pkgs; [ myscript ];
}
```

The unofficial NixOS wiki<sup>1</sup> more great examples on this. It does however miss an example on how to package these scripts for multiple machines (configuration.nix files) so no redundancy occurs. For that I created a simple example<sup>2</sup> with the `bc-dl` script I used in earlier posts:

```
{ config, pkgs, ... }:

let
  bc-dl = pkgs.writeScriptBin "bc-dl" ''
    #!${pkgs.stdenv.shell}
    # This is a script that spawns a nix shell, installs python stuff with
    # bandcamp-dl and downloads an album into a directory

    nix-shell -p python36Packages.virtualenv bash --run bash << EOF

    WDIR="/tmp" # Working directory
    VEDIR="pip" # Virtualenv directory

    if [ -z "$1" ] || [ -z "$2" ]; then
      echo "Please provide all arguments: 
        bc-dl [https://artist.bandcamp.com/album] [/path/to/dest/folder]"
      exit 1
    fi

    virtualenv /tmp/pip

    source /tmp/pip/bin/activate

    pip install bandcamp-downloader

    # $1: bandcamp link
    # $2: destination
    bandcamp-dl --base-dir $2 $1

    echo "Done."

    EOF
  '';
in
{
  config = {
    environment.systemPackages = with pkgs; [ bc-dl ];
  };
}
```

The above script resides in the same (or deeper) directory as `configuration.nix` and can simply be imported like this:

```
imports = [ ./pkgs/bc-dl ];
```

The advantage of this is that you can import this in many different `configuration.nix` files without having to embed the script itself and bloating up the machine configuration.

1. [NixOS Wiki Cookbook](https://nixos.wiki/wiki/Nix_Cookbook)
1. [bc-dl with pkgs.writeScriptBin example](https://github.com/fuerbringer/nixfiles/blob/master/pkgs/bc-dl/default.nix)
