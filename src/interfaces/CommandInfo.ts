export default interface ICommandInfo {
    name: string,
    aliases: Array<string>,
    category: string
    description: string
    usage: string
}