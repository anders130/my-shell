import { bind } from "astal"
import { Gtk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default()

interface Props {
    monitorId: number
}

export default function Workspaces({ monitorId }: Props) {
    const workspaces = bind(hyprland, "workspaces").as((ws) =>
        ws
            .filter((workspace) => workspace.monitor.id === monitorId)
            .sort((a, b) => a.id - b.id)
            .map((workspace) => (
                <button
                    label={workspace.name[workspace.name.length - 1]}
                    halign={Gtk.Align.CENTER}
                    onClick={() =>
                        hyprland.dispatch("workspace", workspace.name)
                    }
                />
            )),
    )

    return (
        <box
            orientation={Gtk.Orientation.HORIZONTAL}
            spacing={5}
            halign={Gtk.Align.CENTER}
        >
            {workspaces}
        </box>
    )
}
