import { bind } from "astal"
import Network from "gi://AstalNetwork"

export default function Wifi() {
    const network = Network.get_default()
    const wifi = bind(network, "wifi")

    return (
        <box visible={wifi.as(Boolean)} className="wifi">
            {wifi.as(
                (wifi) =>
                    wifi && (
                        <icon
                            tooltipText={bind(wifi, "ssid").as(String)}
                            className="Wifi"
                            icon={bind(wifi, "iconName")}
                        />
                    ),
            )}
        </box>
    )
}
