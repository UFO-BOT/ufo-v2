export default interface CommandInfo {
    name: string,
    aliases: Array<string>,
    category: string
    description: string
    usage: string
}