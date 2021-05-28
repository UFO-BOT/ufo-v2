export default interface IItem {
    guildid: string
    name: string
    description: string | null
    addrole: string | null
    removerole: string | null
    price: number
}