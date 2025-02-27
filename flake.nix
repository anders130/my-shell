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
        agsPkgs = inputs.ags.packages.${system};
        deps = [pkgs.pulseaudio];

        packageJson = builtins.toJSON {
            name = "astal-shell";
            dependencies.astal = "${agsPkgs.gjs}";
        };
    in {
        packages.${system}.default = inputs.ags.lib.bundle {
            inherit pkgs;
            src = ./.;
            name = "my-shell";
            entry = "app.ts";

            extraPackages =
                deps
                ++ (with agsPkgs; [
                    apps
                    battery
                    hyprland
                    tray
                ]);
        };

        devShells.${system}.default = pkgs.mkShell {
            buildInputs = deps ++ [agsPkgs.agsFull];
            shellHook = ''
                echo '${packageJson}' | ${pkgs.jq}/bin/jq '.' --indent 4 > package.json
            '';
        };
    };
}
