import Discord from "discord.js";

import ModAction from "@/interfaces/ModAction";

export default interface ICase {
    guildid: Discord.Snowflake
    number: number
    userid: Discord.Snowflake
    executor: Discord.Snowflake
    action: ModAction
    duration: number
    reason: string
    timestamp: number
}