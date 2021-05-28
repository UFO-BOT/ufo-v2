import ModAction from "@/interfaces/ModAction";

export default interface ICase {
    guildid: string
    number: number
    userid: string
    executor: string
    action: ModAction
    duration: number
    reason: string
    timestamp: number
}