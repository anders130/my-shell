import { createState } from "ags"
import Hyprland from "gi://AstalHyprland"

export default function useHyprlandClients() {
    const hypr = Hyprland.get_default()
    const [clients, setClients] = createState(hypr.get_clients())

    // workaround for https://github.com/Aylur/astal/issues/284
    hypr.connect("client-added", (_, client) => {
        setClients((prev) => [...prev, client])
    })
    hypr.connect("client-removed", (_, address) => {
        setClients((prev) => prev.filter((c) => c.address !== address))
    })
    hypr.connect("client-moved", () => {
        setClients(() => hypr.get_clients())
    })

    return clients
}
