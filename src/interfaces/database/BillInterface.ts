import Discord from "discord.js";

export default interface IBill {
    userid: Discord.Snowflake
    billId: string
    payUrl: string
    type: 'standard' | 'premium'
    created: number
    paid: boolean
}