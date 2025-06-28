import { createPoll } from "ags/time"

export default function Clock() {
    const time = createPoll("", 1000, 'date "+%H:%M:%S  -  %e. %b"')
    return <label label={time} />
}
