import CommandFlag from "@/types/CommandFlag";

export default interface DevCommandConfig {
    name: string,
    aliases: Array<string>
    flags?: Array<CommandFlag>
    allowedRoles?: Array<string>
}