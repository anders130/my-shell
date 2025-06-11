{
    pkgs,
    inputs,
    ...
}: let
    inherit (inputs.self.packages.${pkgs.system}) caelestia-scripts quickshell-wrapped;
    caelestiaConfig = ../src;
    scriptsJson = "${caelestiaConfig}/config.json";
in
    pkgs.writeScriptBin "caelestia-quickshell"
    #fish
    ''
        #!${pkgs.fish}/bin/fish

        # Use temporary writable dirs for state/cache (or hardcode if preferred)
        set -lx C_CONFIG ${caelestiaConfig}
        set -lx C_DATA ${caelestia-scripts}/share/caelestia-scripts
        set -lx C_CACHE (mktemp -d)
        set -lx C_STATE (mktemp -d)
        # Provide scripts.json explicitly
        set -lx C_CONFIG_SCRIPTS ${scriptsJson}

        # Override for caelestia shell commands to work with quickshell
        set -l original_caelestia ${caelestia-scripts}/bin/caelestia

        if test "$argv[1]" = "shell" -a -n "$argv[2]"
            set -l cmd $argv[2]
            set -l args $argv[3..]

            switch $cmd
                case "show" "toggle"
                    if test -n "$args[1]"
                        exec ${quickshell-wrapped}/bin/qs -c caelestia ipc call drawers $cmd $args[1]
                    else
                        echo "Usage: caelestia shell $cmd <drawer>"
                        exit 1
                    end
                case "media"
                    if test -n "$args[1]"
                        set -l action $args[1]
                        switch $action
                            case "play-pause"
                                exec ${quickshell-wrapped}/bin/qs -c caelestia ipc call mpris playPause
                            case '*'
                                exec ${quickshell-wrapped}/bin/qs -c caelestia ipc call mpris $action
                        end
                    else
                        echo "Usage: caelestia shell media <action>"
                        exit 1
                    end
                case '*'
                    # For other shell commands, try the original
                    exec $original_caelestia $argv
            end
        else
            # For non-shell commands, use the original
            exec $original_caelestia $argv
        end
    ''
