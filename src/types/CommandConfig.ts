import {ChatInputApplicationCommandData} from "discord.js";
import CommandCategory from "@/types/CommandCategory";

export default interface CommandConfig extends ChatInputApplicationCommandData {
    name: string
    description: string
    aliases: Array<string>
}