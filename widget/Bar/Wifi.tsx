import { bind } from "astal"
import Network from "gi://AstalNetwork"

export default function Wifi() {
    const network = Network.get_default()
    const wifi = bind(network, "wifi")
    const primary = bind(network, "primary")

    return (
        <box
            visible={
                wifi.as(Boolean) &&
                primary.as((p) => p === Network.Primary.WIFI)
            }
            className="wifi"
        >
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
