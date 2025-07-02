import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import Tray from "./Tray"
import Speaker from "./Speaker"
import Clock from "./Clock"
import Battery from "./Battery"
import Wifi from "./Wifi"
import Workspaces from "./Workspaces"

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            name="bar"
            class="Bar"
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={app}
        >
            <centerbox cssName="centerbox">
                <box $type="start">
                    <Workspaces
                        monitorConnector={gdkmonitor.get_connector()!}
                    />
                </box>
                <box $type="center">
                    <Clock />
                </box>
                <box $type="end">
                    <Tray />
                    <Speaker />
                    <Indicators />
                </box>
            </centerbox>
        </window>
    )
}

function Indicators() {
    const wifiRendered = Wifi() !== null
    const batteryRendered = Battery() !== null
    return (
        <box
            class="indicators"
            spacing={10}
            visible={wifiRendered || batteryRendered}
        >
            <Wifi />
            <Battery />
        </box>
    )
}
