import { createState, With } from "ags"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"

const getActiveSinkPort = async () =>
    execAsync("pactl list sinks").then((out) => {
        const active = out.match(/Active Port:\s+(\S+)/)
        return active ? active[1] : "unknown"
    })
const toggleSinkPort = async (
    port: string = "analog-output",
    sink: number = 0,
) => execAsync(`pactl set-sink-port ${sink} ${port}`)

const speakers = "analog-output-lineout"
const headphones = "analog-output-headphones"

const portToIconKey: Record<string, keyof typeof icons> = {
    [speakers]: "speakers",
    [headphones]: "headphones",
}

const icons: Record<string, string> = {
    speakers: "audio-speakers-symbolic",
    headphones: "audio-headphones-symbolic",
    unknown: "audio-volume-muted-symbolic",
}

// state outside to apply to all instances
const [activePort, setActivePort] = createState("unknown")
const port = createPoll("", 5000, getActiveSinkPort)
port.subscribe(() => setActivePort(port.get()))

export default function Speaker() {
    const togglePort = async () => {
        const isHeadphones = activePort.get().includes("headphones")
        await toggleSinkPort(isHeadphones ? speakers : headphones)
        const currentPort = await getActiveSinkPort()
        setActivePort(currentPort)
    }

    getActiveSinkPort().then(setActivePort)

    return (
        <With value={activePort}>
            {(port) => (
                <button
                    visible={portToIconKey[port] !== undefined}
                    onClicked={togglePort}
                    tooltipText={port}
                >
                    <image iconName={icons[portToIconKey[port]]} />
                </button>
            )}
        </With>
    )
}
