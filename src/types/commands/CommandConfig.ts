import {ChatInputApplicationCommandData} from "discord.js";

export default interface CommandConfig extends ChatInputApplicationCommandData {
    name: string
    description: string
    aliases: Array<string>
}