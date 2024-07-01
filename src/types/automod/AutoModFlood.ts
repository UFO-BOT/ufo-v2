import AutoMod from "@/types/automod/AutoMod";
import {Snowflake} from "discord.js";

export interface AutoModFloodOptions {
    messages: number
    symbols: number
}

export interface AutoModFlood extends AutoMod {
    options?: AutoModFloodOptions
}