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
        quickshell = inputs.quickshell.packages.${system}.default;
        inherit (pkgs) mkShell;
    in {
        devShells.${system}.default = mkShell {
            buildInputs = [quickshell];
            shellHook = ''
                export QML2_IMPORT_PATH="${quickshell}/lib/qt-6/qml:$QML2_IMPORT_PATH}"
            '';
        };
    };
}
