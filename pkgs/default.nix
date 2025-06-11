{
    pkgs,
    lib,
    inputs,
    ...
}: let
    inherit (builtins) readDir attrNames filter listToAttrs;
    inherit (lib) hasSuffix removeSuffix;
in
    ./.
    |> readDir
    |> attrNames
    |> filter (name: hasSuffix ".nix" name)
    |> filter (name: name != "default.nix")
    |> map (name: {
        name = removeSuffix ".nix" name;
        value = pkgs.callPackage (./. + "/${name}") {inherit inputs;};
    })
    |> listToAttrs
