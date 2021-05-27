import Discord from "discord.js";

export default interface ICoupon {
    guildid: Discord.Snowflake
    name: string
    amount: number
    usages: number
    usedBy: Array<Discord.Snowflake>
    created: number
    duration: number
}