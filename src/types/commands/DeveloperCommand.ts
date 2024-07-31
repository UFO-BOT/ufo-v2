export default interface DeveloperCommand {
    name: string
    aliases: Array<string>
    allowedUsers?: Array<string>
}