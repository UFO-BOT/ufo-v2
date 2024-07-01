import {Snowflake} from "discord.js";

export default interface FloodDetection {
    messages: Array<Snowflake>
    symbols: number
    first: Date
}