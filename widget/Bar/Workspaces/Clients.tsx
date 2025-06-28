import { createBinding, For } from "ags"
import Hyprland from "gi://AstalHyprland"
import Apps from "gi://AstalApps"

interface ClientsProps {
    workspaceId: number
}

export default function Clients({ workspaceId }: ClientsProps) {
    const hyprland = Hyprland.get_default()
    const clients = createBinding(hyprland, "clients").as((cs) =>
        Object.entries(
            cs
                .filter((c) => c.workspace.id === workspaceId)
                .reduce(
                    (acc, c) => {
                        const key = c.class || c.title
                        if (!acc[key]) {
                            acc[key] = { count: 0, client: c }
                        }
                        acc[key].count++
                        return acc
                    },
                    {} as Record<
                        string,
                        { count: number; client: Hyprland.Client }
                    >,
                ),
        ),
    )
    return (
        <box>
            <For each={clients}>
                {([_, { count, client }]) => (
                    <box spacing={2}>
                        <image iconName={getClientIcon(client)} />
                        {count > 1 && (
                            <label class="app-count" label={count.toString()} />
                        )}
                    </box>
                )}
            </For>
        </box>
    )
}

const apps = new Apps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
})

function getClientIcon(client: Hyprland.Client): string | undefined {
    const normalize = (name: string) => name.split(".").pop()?.toLowerCase()

    const normalizedClass = normalize(client.class)
    if (!normalizedClass) return undefined

    const searchQueries = [normalizedClass, client.title.toLowerCase()]

    for (const query of searchQueries) {
        const matches = query ? apps.fuzzy_query(query) : []
        if (matches.length) return matches[0].iconName
    }

    return apps.list.find((app) =>
        app.entry.toLowerCase().includes(normalizedClass),
    )?.iconName
}
