# my-shell

My personal widget collection for Hyprland.

## Installation

Add this project to your `flake.nix`'s inputs:

```nix
{
    inputs = {
        # ...
        my-shell.url = "github:anders130/my-shell";
    };
```

Then to use it, add it to your package list:

```nix
{
    environment.systemPackages = [inputs.my-shell.packages.${system}.default];
}
```

To use the battery indicator, you need to have `upower` enabled:

```nix
services.upower.enable = true;
```

For the Speaker selector, you need to have `pulseaudio` enabled:

```nix
services.pulseaudio.enable = true;
```

## Development

First, add the types for your lsp server by running the following command:

```bash
ags types -d .
```

Then, run the following command to test your changes:

```bash
ags run .
or alternatively with nix:
nix run .
```
