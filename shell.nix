{pkgs ? import <nixpkgs>{}}:

pkgs.mkShell
{
  nativeBuildInputs = [
    pkgs.gnumake
    pkgs.git
    pkgs.nodejs_22
    pkgs.typescript
  ];
}
