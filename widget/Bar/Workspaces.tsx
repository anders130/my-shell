import { Gtk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default()

export default function Workspaces() {
    print(hyprland.get_workspaces())
    return <button label="🏠 Home" halign={Gtk.Align.CENTER} />
}
