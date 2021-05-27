import Discord from "discord.js";

export default interface IBalance {
    guildid: Discord.Snowflake
    userid: Discord.Snowflake
    balance: number
    xp: number
    lastwork: number
    lastmb: number
    lastDailyBonus: number
    lastWeeklyBonus: number
}