import { bind } from "astal"
import { Gtk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Apps from "gi://AstalApps"

const hyprland = Hyprland.get_default()
const apps = new Apps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
})

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
                    halign={Gtk.Align.CENTER}
                    onClick={() =>
                        hyprland.dispatch("workspace", workspace.name)
                    }
                >
                    <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
                        <label>
                            {workspace.name[workspace.name.length - 1]}
                        </label>
                        <Clients workspaceId={workspace.id} />
                    </box>
                </button>
            )),
    )

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER}>
            {workspaces}
        </box>
    )
}

function getIcons(appName: string) {
    return (
        apps.fuzzy_query(appName)?.at(0)?.iconName || "application-default-icon"
    )
}

function Clients({ workspaceId }: { workspaceId: number }) {
    const clients = bind(hyprland, "clients").as((cs) =>
        Object.entries(
            cs
                .filter((client) => client.workspace.id === workspaceId)
                .reduce(
                    (acc, client) => {
                        const key = client.class || client.title
                        acc[key] = (acc[key] || 0) + 1
                        return acc
                    },
                    {} as Record<string, number>,
                ),
        ).map(([app, count]) => (
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={2}>
                <icon icon={getIcons(app)} />
                {count > 1 && <label className="app-count">{count}</label>}
            </box>
        )),
    )

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
            {clients}
        </box>
    )
}
