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
        packages.${system} = {
            default = inputs.ags.lib.bundle {
                inherit pkgs;
                src = ./.;
                name = "my-shell";
                entry = "app.ts";

                # additional libraries and executables to add to gjs' runtime
                extraPackages = [
                    # ags.packages.${system}.battery
                    # pkgs.fzf
                ];
            };
        };

        devShells.${system} = {
            default = pkgs.mkShell {
                buildInputs = [
                    # includes all Astal libraries
                    # ags.packages.${system}.agsFull

                    # includes astal3 astal4 astal-io by default
                    (inputs.ags.packages.${system}.default.overrideAttrs {
                        extraPackages = [
                            # cherry pick packages
                        ];
                    })
                ];
            };
        };
    };
}
