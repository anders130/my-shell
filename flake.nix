{
    description = "My Awesome Desktop Shell";

    inputs = {
        nixpkgs.url = "nixpkgs/nixos-unstable";
        astal = {
            url = "github:aylur/astal";
            inputs.nixpkgs.follows = "nixpkgs";
        };
        ags = {
            url = "github:aylur/ags";
            inputs.nixpkgs.follows = "nixpkgs";
            inputs.astal.follows = "astal";
        };
    };

    outputs = inputs: let
        system = "x86_64-linux";
        pkgs = inputs.nixpkgs.legacyPackages.${system};
        ags = inputs.ags.packages.${system}.default;

        astalPackages = with inputs.astal.packages.${system}; [
            astal4
            hyprland
            apps
            battery
            network
            tray
            powerprofiles
        ];

        runtimePackages = [pkgs.pulseaudio];

        name = "my-shell";
        entry = "app.ts";
    in {
        packages.${system}.default = pkgs.stdenv.mkDerivation {
            inherit name;
            src = ./.;

            nativeBuildInputs = with pkgs; [
                wrapGAppsHook
                gobject-introspection
                ags
            ];

            buildInputs =
                astalPackages
                ++ [
                    pkgs.gjs
                    pkgs.glib
                ];

            installPhase = ''
                runHook preInstall

                mkdir -p $out/bin
                mkdir -p $out/share
                cp -r * $out/share
                ags bundle ${entry} $out/bin/${name} -d "SRC='$out/share'"

                runHook postInstall
            '';

            preFixup = ''
                gappsWrapperArgs+=(--prefix PATH : ${pkgs.lib.makeBinPath runtimePackages})
            '';
        };
        devShells.${system}.default = pkgs.mkShell {
            buildInputs = [
                (ags.override {
                    extraPackages = astalPackages ++ runtimePackages;
                })
            ];
        };
    };
}
