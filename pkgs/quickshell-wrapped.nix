{
    inputs,
    lib,
    pkgs,
}: let
    inherit (pkgs.qt6.qtbase) qtPluginPrefix qtQmlPrefix;
    qsBinary = inputs.quickshell.packages.${pkgs.system}.default + "/bin/qs";
    binPath = lib.makeBinPath [pkgs.fd pkgs.coreutils];
in
    pkgs.runCommand "quickshell-wrapped" {
        nativeBuildInputs = [pkgs.makeWrapper];
    } ''
        mkdir -p $out/bin
        makeWrapper ${qsBinary} $out/bin/qs \
          --prefix QT_PLUGIN_PATH : "${pkgs.qt6.qtbase}/${qtPluginPrefix}" \
          --prefix QT_PLUGIN_PATH : "${pkgs.qt6.qt5compat}/${qtPluginPrefix}" \
          --prefix QML2_IMPORT_PATH : "${pkgs.qt6.qt5compat}/${qtQmlPrefix}" \
          --prefix QML2_IMPORT_PATH : "${pkgs.qt6.qtdeclarative}/${qtQmlPrefix}" \
          --prefix PATH : "${binPath}"
    ''
