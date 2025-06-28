import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"

const monitors = []
app.start({
    css: style,
    main() {
        app.get_monitors().map((monitor) => {
            monitors.push(monitor)
            Bar(monitor, monitors.length - 1)
        })
    },
})
