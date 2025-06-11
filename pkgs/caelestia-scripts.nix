{
    pkgs,
    lib,
    ...
}:
pkgs.stdenv.mkDerivation {
    pname = "caelestia-scripts";
    version = "unstable-2024-01-07";

    src = pkgs.fetchFromGitHub {
        owner = "caelestia-dots";
        repo = "scripts";
        rev = "main";
        sha256 = "sha256-agQPRI7mnbIHyW5M+Wr0NJMOLeRe0i5qFrAYsGTDEzI=";
    };

    nativeBuildInputs = with pkgs; [
        makeWrapper
    ];

    buildInputs = with pkgs; [
        fish
        (python3.withPackages (ps:
            with ps; [
                materialyoucolor
                pillow
            ]))
    ];

    patchPhase = ''
  find . -name "*.fish" -type f | while read -r file; do
    sed -i 's|$src/../data/schemes|$C_DATA/schemes|g' "$file"
    sed -i 's|(dirname (status filename))/data|$C_DATA|g' "$file"
    sed -i 's|$src/data|$C_DATA|g' "$file"
  done

  find . -name "*.py" -type f | while read -r file; do
    sed -i 's|os.path.expanduser("~/.local/share/caelestia")|os.environ.get("C_DATA", "/default/path")|g' "$file"
    sed -i 's|Path.home() / ".local" / "share" / "caelestia"|Path(os.environ.get("C_DATA", "/default/path"))|g' "$file"
  done
'';

installPhase = ''
  mkdir -p $out/bin
  mkdir -p $out/share/caelestia-scripts

  cp -r * $out/share/caelestia-scripts/

  # Fix Python shebangs here as before...

  # Make Python scripts executable as before...

  # No setup script!

  makeWrapper ${pkgs.fish}/bin/fish $out/bin/caelestia \
    --set C_DATA $out/share/caelestia-scripts/data \
    --set C_CONFIG $out/share/caelestia-scripts/shell \
    --prefix PATH : ${lib.makeBinPath (with pkgs; [
      imagemagick wl-clipboard fuzzel socat foot jq
      (python3.withPackages (ps: with ps; [materialyoucolor pillow]))
      grim wayfreeze wl-screenrec git coreutils findutils gnugrep xdg-user-dirs
    ])}
  '';

    # patchPhase = ''
    #     # Fix hardcoded paths to use XDG directories
    #     # For Fish files - use $HOME which Fish understands
    #     find . -name "*.fish" -type f | while read -r file; do
    #         # Replace specific patterns found in the scripts
    #         sed -i 's|$src/../data/schemes|$HOME/.local/share/caelestia/schemes|g' "$file"
    #         sed -i 's|(dirname (status filename))/data|$HOME/.local/share/caelestia|g' "$file"
    #         sed -i 's|$src/data|$HOME/.local/share/caelestia|g' "$file"
    #     done
    #
    #     # For Python files
    #     find . -name "*.py" -type f | while read -r file; do
    #         sed -i 's|os.path.join(os.path.dirname(__file__), "..", "data")|os.path.expanduser("~/.local/share/caelestia")|g' "$file"
    #         sed -i 's|Path(__file__).parent.parent / "data"|Path.home() / ".local" / "share" / "caelestia"|g' "$file"
    #     done
    # '';
    #
    # installPhase = ''
    #     mkdir -p $out/bin
    #     mkdir -p $out/share/caelestia-scripts
    #
    #     # Copy all the scripts to share directory
    #     cp -r * $out/share/caelestia-scripts/
    #
    #     # Fix Python shebangs for NixOS with the wrapped Python
    #     find $out/share/caelestia-scripts -name "*.py" -type f -exec sed -i '1s|^#!/bin/python3|#!${pkgs.python3.withPackages (ps: with ps; [materialyoucolor pillow])}/bin/python3|' {} \;
    #     find $out/share/caelestia-scripts -name "*.py" -type f -exec sed -i '1s|^#!/bin/python|#!${pkgs.python3.withPackages (ps: with ps; [materialyoucolor pillow])}/bin/python|' {} \;
    #     find $out/share/caelestia-scripts -name "*.py" -type f -exec sed -i '1s|^#!/usr/bin/env python3|#!${pkgs.python3.withPackages (ps: with ps; [materialyoucolor pillow])}/bin/python3|' {} \;
    #     find $out/share/caelestia-scripts -name "*.py" -type f -exec sed -i '1s|^#!/usr/bin/env python|#!${pkgs.python3.withPackages (ps: with ps; [materialyoucolor pillow])}/bin/python|' {} \;
    #
    #     # Make Python scripts executable
    #     find $out/share/caelestia-scripts -name "*.py" -type f -exec chmod +x {} \;
    #
    #     # Create a setup script that ensures data directories exist
    #     cat > $out/bin/caelestia-setup <<EOF
    #     #!/bin/sh
    #     DATA_HOME="\$HOME/.local/share/caelestia"
    #     STATE_HOME="\$HOME/.local/state/caelestia"
    #     CACHE_HOME="\$HOME/.cache/caelestia"
    #
    #     mkdir -p "\$DATA_HOME/schemes/dynamic"
    #     mkdir -p "\$STATE_HOME/wallpaper"
    #     mkdir -p "\$CACHE_HOME/schemes"
    #
    #     # Copy data files if they don't exist
    #     if [ ! -d "\$DATA_HOME/schemes" ] && [ -d "$out/share/caelestia-scripts/data/schemes" ]; then
    #       cp -r "$out/share/caelestia-scripts/data/schemes" "\$DATA_HOME/"
    #     fi
    #     if [ ! -f "\$DATA_HOME/config.json" ] && [ -f "$out/share/caelestia-scripts/data/config.json" ]; then
    #       cp "$out/share/caelestia-scripts/data/config.json" "\$DATA_HOME/"
    #     fi
    #     if [ ! -f "\$DATA_HOME/emojis.txt" ] && [ -f "$out/share/caelestia-scripts/data/emojis.txt" ]; then
    #       cp "$out/share/caelestia-scripts/data/emojis.txt" "\$DATA_HOME/"
    #     fi
    #     EOF
    #     chmod +x $out/bin/caelestia-setup
    #
    #     # Create wrapper for main script with all required tools in PATH
    #     makeWrapper ${pkgs.fish}/bin/fish $out/bin/caelestia \
    #       --add-flags "$out/share/caelestia-scripts/main.fish" \
    #       --run "$out/bin/caelestia-setup" \
    #       --prefix PATH : ${lib.makeBinPath (with pkgs; [
    #         imagemagick
    #         wl-clipboard
    #         fuzzel
    #         socat
    #         foot
    #         jq
    #         (python3.withPackages (ps: with ps; [materialyoucolor pillow]))
    #         grim
    #         wayfreeze
    #         wl-screenrec
    #         git
    #         coreutils
    #         findutils
    #         gnugrep
    #         xdg-user-dirs
    #     ])}
    # '';

    meta = with lib; {
        description = "Caelestia dotfiles scripts";
        license = licenses.mit;
        platforms = platforms.linux;
    };
}
