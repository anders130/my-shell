import Hyprland from "gi://AstalHyprland"
import { createBinding, For } from "ags"
import Clients from "./Clients"

interface WorkspacesProps {
    monitorConnector: string
}

export default function Workspaces({ monitorConnector }: WorkspacesProps) {
    const hyprland = Hyprland.get_default()
    const workspaces = createBinding(hyprland, "workspaces").as((ws) =>
        ws
            .filter((w) => w.monitor.name === monitorConnector)
            .sort((a, b) => a.id - b.id),
    )

    return (
        <box>
            <For each={workspaces}>
                {(workspace) => (
                    <button
                        onClicked={() =>
                            hyprland.dispatch("workspace", workspace.name)
                        }
                    >
                        <box spacing={4}>
                            <label
                                label={
                                    workspace.name[workspace.name.length - 1]
                                }
                            />
                            <Clients workspaceId={workspace.id} />
                        </box>
                    </button>
                )}
            </For>
        </box>
    )
}
