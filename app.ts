import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar/Bar"

const monitors = []
App.start({
    css: style,
    main() {
        App.get_monitors().map((monitor) => {
            monitors.push(monitor)
            Bar(monitor, monitors.length - 1)
        })
    },
})
