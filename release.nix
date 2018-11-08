{ pkgs ? import <nixpkgs> {} }:

(pkgs.callPackage ./mkHakyll.nix) {
  src     = ./src;
  name    = "fuerbringer.info";
  version = "1";
}
