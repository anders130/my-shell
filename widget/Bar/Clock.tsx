import { Variable } from "astal"

const date = Variable("-").poll(1000, 'date "+%H:%M:%S  -  %e. %b"')

export default function Clock() {
    return <label label={date()} />
}
