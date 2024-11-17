import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import Workspaces from "./Workspaces"
import SystemTray from "./SystemTray"
import Sound from "./Sound"
import Clock from "./Clock"

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
                    <Workspaces gdkmonitor={gdkmonitor} />
                </box>
                <box halign={Gtk.Align.CENTER}>
                    <Clock />
                </box>
                <box halign={Gtk.Align.END}>
                    <SystemTray />
                    <Sound />
                </box>
            </centerbox>
        </window>
    )
}
