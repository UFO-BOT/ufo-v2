import Language from "@/types/Language";
import CommandOptionConfig from "@/types/CommandOptionConfig";
import {ChannelType} from "discord.js";

export default interface CommandOption {
    type: any
    name: string
    config: Record<Language, CommandOptionConfig>
    minValue?: number
    maxValue?: number
    minLength?: number
    maxLength?: number
    channelTypes?: Array<ChannelType>
    required: boolean
}