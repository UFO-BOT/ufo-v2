import ModAction from "../ModAction";

export default interface Case {
    guildid: string
    number: number
    userid: string
    executor: string
    action: ModAction
    duration: number
    reason: string
    timestamp: number
}