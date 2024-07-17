import {ApplicationCommandOptionType} from "discord.js";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Language from "@/types/Language";

export default function CommandUsage(command: AbstractCommand, prefix: string, language: Language): string {
    let usage = "`" + prefix + command.config[language].name;
    command.options.forEach(option => {
        let config = option.config[language]
        let name = config.choices?.length ? config.choices.map(c => c.name).join(" | ") : config.name
        let type = ApplicationCommandOptionType[option.type]
        usage += ` ${option.required ? "<" : "["}${(type === "Boolean" ? '-' : '') + name}${option.required ? ">" : "]"}`
    })
    usage += "`"
    return usage
}