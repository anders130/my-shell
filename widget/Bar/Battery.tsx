import { bind } from "astal"
import AstalBattery from "gi://AstalBattery"

export default function Battery() {
    const battery = AstalBattery.get_default()

    return (
        <box
            className="Battery"
            visible={bind(battery, "isPresent")}
            spacing={4}
        >
            <icon icon={bind(battery, "batteryIconName")} />
            <label
                label={bind(battery, "percentage").as(
                    (p) => `${Math.floor(p * 100)}%`,
                )}
            />
        </box>
    )
}
