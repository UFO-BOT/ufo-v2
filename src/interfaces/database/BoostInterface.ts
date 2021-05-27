import Discord from "discord.js";

export default interface IBoost {
    userid: Discord.Snowflake
    count: number
    used: number
}