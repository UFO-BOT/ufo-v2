import Discord from "discord.js";

export default interface IItem {
    guildid: Discord.Snowflake
    name: string
    description: string | null
    addrole: string | null
    removerole: string | null
    price: number
}