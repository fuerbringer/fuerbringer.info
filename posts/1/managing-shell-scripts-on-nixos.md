So you've got a bunch of shell scripts laying around to get various small
userspace tasks done. On a regular GNU/Linux or unix-like operating system
you'd simply chuck the scripts into `/usr/bin/` or `/usr/sbin`. The extra fancy
variant would be to use GNU stow to have them symlinked from a versioned
directory.

On NixOS this would be quite ugly. This fact becomes apparent once one takes a
look at the `/usr/bin` directory on NixOS:

```
$ ls -l /usr/bin
total 4
lrwxrwxrwx 1 root root 66 Feb 23 10:26 env ->
/nix/store/68z2cvbzws1pn0z8dhgfkmws75r2z7gm-coreutils-8.29/bin/env

```

Nope! This is the territory of the Nix system. When you use NixOS, you shall
play ball with Nix.  Packages on NixOS are defined as so-called *derivations*
on NixOS. They become available once imported into the environments packages. 
So why not just define our scripts as Nix derivations? This may sound
complicated, but it's not.

I recently wrote a bash script<sup>1</sup> that spawns a virtualenv
inside of a Nix shell to download Bandcamp<sup>2</sup> albums. Let's see how
that works as a derivation:
```
with import <nixpkgs> {};

stdenv.mkDerivation rec {
  name = "bc-dl";
  version = "1.0.0";

  buildInputs = [ makeWrapper ];

  unpackPhase = "true";

  installPhase = ''
    mkdir -p $out/bin
    cp ${./bc-dl} $out/bin/${name}
    for f in $out/bin/*; do
      wrapProgram $f
        --prefix PATH : ${stdenv.lib.makeBinPath [ coreutils ]}
    done
  '';

}
```

This `default.nix` file simply takes `bc-dl`, the shell script, and tells NixOS
to put it in its long hash-like directories you're used to. This involves
patching the shebang and bringing packages into scope, like `coreutils`.

To actually get this installed the derivation has to have the script present
and be in a reasonable place where your `/etc/nixos/configuration.nix` has
access to it. In your `environment.systemPackages` define the folder where your
`default.nix` resides:

```
environment.systemPackages = [
  (import ./pkgs/bc-dl)
  # Other packages
  # ...
];
```

After a `nixos-rebuild switch` your script should be available like it would be
from `/usr/bin` or similar. A full example can be found in my
[nixfiles](https://github.com/fuerbringer/nixfiles/tree/master/pkgs/bc-dl).

### Footnotes
1. [bc-dl](https://github.com/fuerbringer/nixfiles/blob/master/pkgs/bc-dl/bc-dl)
2. Bandcamp is great and I do buy albums there. Support [drm-free](https://www.defectivebydesign.org/) music!
