{
    description = "My Awesome Desktop Shell";

    inputs = {
        nixpkgs.url = "nixpkgs/nixos-unstable";
        ags = {
            url = "github:aylur/ags";
            inputs.nixpkgs.follows = "nixpkgs";
        };
    };

    outputs = inputs: let
        system = "x86_64-linux";
        pkgs = inputs.nixpkgs.legacyPackages.${system};
        agsPkgs = inputs.ags.packages.${system};

        astalPackages = with agsPkgs; [
            astal4
            hyprland
            apps
            battery
            network
            tray
            powerprofiles
        ];

        pname = "my-shell";
        entry = "app.ts";
        extraPackages =
            astalPackages
            ++ (with pkgs; [
                pulseaudio
            ]);
    in {
        packages.${system} = {
            default = pkgs.stdenv.mkDerivation {
                name = pname;
                src = ./.;

                nativeBuildInputs = with pkgs; [
                    wrapGAppsHook
                    gobject-introspection
                    agsPkgs.default
                ];

                buildInputs = extraPackages ++ [pkgs.gjs];

                installPhase = ''
                    runHook preInstall

                    mkdir -p $out/bin
                    mkdir -p $out/share
                    cp -r * $out/share
                    ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

                    runHook postInstall
                '';
            };
        };
        devShells.${system}.default = pkgs.mkShell {
            buildInputs = [
                (agsPkgs.default.override {
                    inherit extraPackages;
                })
            ];
        };
    };
}
