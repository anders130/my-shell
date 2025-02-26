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
                        if (!acc[key]) {
                            acc[key] = { count: 0, client }
                        }
                        acc[key].count += 1
                        return acc
                    },
                    {} as Record<
                        string,
                        { count: number; client: Hyprland.Client }
                    >,
                ),
        ).map(([_, { count, client }]) => (
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={2}>
                <icon icon={getIcons(client)} />
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

function getIcons(client: Hyprland.Client): string {
    const likelyApps = apps.fuzzy_query(client.class)
    if (likelyApps.length === 0) {
        likelyApps.push(...apps.fuzzy_query(client.title))
    }
    return likelyApps[0].iconName
}
