import { bind } from "astal"
import Tray from "gi://AstalTray"
import { Astal, Gdk, Gtk } from "astal/gtk3"

export default function SystemTray() {
    const tray = Tray.get_default()

    return (
        <box className="SysTray">
            {bind(tray, "items").as((items) =>
                items.map((item) => {
                    return (
                        <button
                            tooltipMarkup={bind(item, "tooltipMarkup")}
                            onClickRelease={(self, event) => {
                                switch (event.button) {
                                    case Astal.MouseButton.PRIMARY:
                                        item.activate(0, 0)
                                        break
                                    case Astal.MouseButton.SECONDARY:
                                        const menu = Gtk.Menu.new_from_model(
                                            item.menuModel,
                                        )
                                        menu.insert_action_group(
                                            "dbusmenu",
                                            item.actionGroup,
                                        )

                                        menu.popup_at_widget(
                                            self,
                                            Gdk.Gravity.SOUTH_EAST,
                                            Gdk.Gravity.NORTH_EAST,
                                            null,
                                        )
                                        break
                                }
                            }}
                        >
                            <icon gicon={bind(item, "gicon")} />
                        </button>
                    )
                }),
            )}
        </box>
    )
}
