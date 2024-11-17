{
    description = "My Awesome Desktop Shell";

    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

        ags = {
            url = "github:aylur/ags";
            inputs.nixpkgs.follows = "nixpkgs";
        };
    };

    outputs = inputs: let
        system = "x86_64-linux";
        pkgs = inputs.nixpkgs.legacyPackages.${system};
    in {
        packages.${system}.default = inputs.ags.lib.bundle {
            inherit pkgs;
            src = ./.;
            name = "my-shell";
            entry = "app.ts";

            extraPackages = with inputs.ags.packages.${system}; [
                hyprland
                tray
            ];
        };

        devShells.${system} = {
            default = pkgs.mkShell {
                buildInputs = [
                    inputs.ags.packages.${system}.agsFull
                ];
            };
        };
    };
}
