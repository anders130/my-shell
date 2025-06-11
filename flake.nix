{
    description = "My Awesome Desktop Shell";

    inputs = {
        nixpkgs.url = "nixpkgs/nixos-unstable";
        quickshell = {
            url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";
            inputs.nixpkgs.follows = "nixpkgs";
        };
    };

    outputs = inputs: let
        system = "x86_64-linux";
        pkgs = inputs.nixpkgs.legacyPackages.${system};
        inherit (pkgs) lib;
    in {
        packages.${system} = import ./pkgs {
            inherit pkgs lib inputs;
        };
        devShells.${system}.default = pkgs.mkShell {
            buildInputs = with inputs.self.packages.${system};
                [
                    quickshell-wrapped
                    # caelestia-scripts
                    caelestia-wrapped
                ]
                ++ (with pkgs; [
                    # Qt dependencies
                    qt6.qt5compat
                    qt6.qtdeclarative

                    # Runtime dependencies
                    hyprpaper
                    imagemagick
                    wl-clipboard
                    fuzzel
                    socat
                    foot
                    jq
                    python3
                    python3Packages.materialyoucolor
                    grim
                    wayfreeze
                    wl-screenrec
                    # inputs.astal.packages.${pkgs.system}.default

                    # Additional dependencies
                    lm_sensors
                    curl
                    material-symbols
                    nerd-fonts.jetbrains-mono
                    ibm-plex
                    fd
                    python3Packages.pyaudio
                    python3Packages.numpy
                    cava
                    networkmanager
                    bluez
                    ddcutil
                    brightnessctl
                ]);
        };
    };
}
