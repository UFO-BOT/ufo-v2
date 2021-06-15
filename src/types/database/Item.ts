export default interface Item {
    guildid: string
    name: string
    description: string | null
    addrole: string | null
    removerole: string | null
    price: number
}