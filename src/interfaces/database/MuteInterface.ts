import Discord from "discord.js";

export default interface IMute {
    guildid: Discord.Snowflake
    userid: Discord.Snowflake
    muterole: Discord.Snowflake
    casenum: number
    infinity: boolean
    started: number
}