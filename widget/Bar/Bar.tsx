import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { Variable } from "astal"
import Workspaces from "./Workspaces"
import SystemTray from "./SystemTray"
import Sound from "./Sound"
import Clock from "./Clock"

const time = Variable("").poll(1000, "date")

export default function Bar(gdkmonitor: Gdk.Monitor) {
    return (
        <window
            className="Bar"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            application={App}
        >
            <centerbox>
                <box halign={Gtk.Align.START}>
                    <Workspaces />
                </box>
                <Clock />
                <box halign={Gtk.Align.END}>
                    <SystemTray />
                    <Sound />
                </box>
            </centerbox>
        </window>
    )
}
