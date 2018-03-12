with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "fuerbringer.info";
  src  = ./.;
  installPhase = ''
    mkdir -p "$out/web"
	  cp -ra * "$out/web"
    cp ./.env "$out/web"
  '';
}
