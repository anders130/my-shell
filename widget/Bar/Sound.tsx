import { bind, exec } from "astal"
import Variable from "astal/variable"

const activePort = Variable("Unknown")

export default function Sound() {
    const icons = {
        headphones: "audio-headphones-symbolic",
        speakers: "audio-speakers-symbolic",
        unknown: "dialog-question-symbolic",
    }

    const updateActivePort = () => {
        const sinks = exec("pactl list sinks")
        const activePortMatch = sinks.match(/Active Port:\s+(\S+)/)
        const port = activePortMatch ? activePortMatch[1] : "Unknown"

        activePort.set(port)
    }

    const togglePort = () => {
        const isHeadPhones = activePort.get().includes("headphones")
        const command = `pactl set-sink-port 0 analog-output-${isHeadPhones ? "lineout" : "headphones"}`

        exec(command)
        updateActivePort()
    }

    updateActivePort()

    return (
        <button
            onClicked={togglePort}
            visible={bind(activePort).as((p) => p !== "Unknown")}
        >
            <icon
                icon={bind(activePort).as((p) =>
                    p.includes("headphones")
                        ? icons.headphones
                        : p.includes("lineout") || p.includes("speakers")
                          ? icons.speakers
                          : icons.unknown,
                )}
            />
        </button>
    )
}
