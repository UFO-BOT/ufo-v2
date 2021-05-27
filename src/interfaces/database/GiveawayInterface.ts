import Discord from "discord.js";

export default interface IGiveaway {
    guildid: Discord.Snowflake
    channel: Discord.Snowflake
    message: Discord.Snowflake
    creator: Discord.Snowflake
    number: number
    prize: number
    started: number
    duration: number
}