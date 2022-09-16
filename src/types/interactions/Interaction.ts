import {EmbedBuilder} from "discord.js";

export default interface Interaction {
    id: string
    users: Array<string>
    data: any
    embed: EmbedBuilder
    lifetime: number
}