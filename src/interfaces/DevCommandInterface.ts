import ICommandFlag from "@/interfaces/CommandFlagInterface";

export default interface IDevCommand {
    name: string,
    aliases: Array<string>
    flags?: Array<ICommandFlag>
    allowedRoles?: Array<string>
}