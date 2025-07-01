import { createBinding, For, With } from "ags"
import { execAsync } from "ags/process"
import AstalNetwork from "gi://AstalNetwork"
import Gtk from "gi://Gtk"

interface WifiItemProps {
    ap: AstalNetwork.AccessPoint
    wifi: AstalNetwork.Wifi
}

function WifiItem({ ap, wifi }: WifiItemProps) {
    async function connect(ap: AstalNetwork.AccessPoint) {
        // connecting to ap is not yet supported
        // https://github.com/Aylur/astal/pull/13
        try {
            await execAsync(`nmcli d wifi connect ${ap.bssid}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <button onClicked={() => connect(ap)}>
            <box spacing={4}>
                <image iconName={createBinding(ap, "iconName")} />
                <label label={createBinding(ap, "ssid")} />
                <image
                    iconName="object-select-symbolic"
                    visible={createBinding(
                        wifi,
                        "activeAccessPoint",
                    )((active) => active === ap)}
                />
            </box>
        </button>
    )
}

export default function Wifi() {
    const network = AstalNetwork.get_default()
    const wired = createBinding(network, "wired")
    const wifi = createBinding(network, "wifi")
    const accessPoints = createBinding(wifi.get(), "accessPoints").as((a) =>
        a.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength),
    )

    return (
        <box visible={wifi(Boolean) && wired.as((w) => !w)}>
            <With value={wifi}>
                {(wifi) =>
                    wifi && (
                        <menubutton>
                            <image iconName={createBinding(wifi, "iconName")} />
                            <popover>
                                <box orientation={Gtk.Orientation.VERTICAL}>
                                    <For each={accessPoints}>
                                        {(ap: AstalNetwork.AccessPoint) => (
                                            <WifiItem
                                                ap={ap}
                                                wifi={wifi}
                                            ></WifiItem>
                                        )}
                                    </For>
                                </box>
                            </popover>
                        </menubutton>
                    )
                }
            </With>
        </box>
    )
}
