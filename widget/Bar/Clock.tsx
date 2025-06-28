import { createPoll } from "ags/time"

const time = createPoll("", 1000, 'date "+%H:%M:%S  -  %e. %b"')

export default function Clock() {
    return <label label={time} />
}
