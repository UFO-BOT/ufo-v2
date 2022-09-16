import {ChatInputApplicationCommandData} from "discord.js";
import CommandCategory from "@/types/commands/CommandCategory";

export default interface CommandConfig extends ChatInputApplicationCommandData {
    name: string
    description: string
    aliases: Array<string>
}