import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import Workspaces from "./Workspaces"
import Tray from "./Tray"
import Sound from "./Sound"
import Clock from "./Clock"
import Battery from "./Battery"
import Wifi from "./Wifi"

export default function Bar(gdkmonitor: Gdk.Monitor, monitorId: number) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            className="Bar"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={App}
        >
            <centerbox>
                <box halign={Gtk.Align.START}>
                    <Workspaces monitorId={monitorId} />
                </box>
                <box halign={Gtk.Align.CENTER}>
                    <Clock />
                </box>
                <box halign={Gtk.Align.END}>
                    <Tray />
                    <Sound />
                    <Indicators />
                </box>
            </centerbox>
        </window>
    )
}

function Indicators() {
    const wifi = Wifi()
    const battery = Battery()

    const isVisible = wifi.visible || battery.visible

    return (
        <box spacing={10} className="indicators" visible={isVisible}>
            {wifi}
            {battery}
        </box>
    )
}
