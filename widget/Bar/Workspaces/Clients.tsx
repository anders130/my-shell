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
    workspaceId: number
}

export default function Clients({ workspaceId }: Props) {
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

function getIcons(appName: string) {
    return (
        apps.fuzzy_query(appName)?.at(0)?.iconName || "application-default-icon"
    )
}
