import Language from "@/types/Language";
import CommandOptionConfig from "@/types/commands/CommandOptionConfig";
import {ChannelType} from "discord.js";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

export default interface CommandOption {
    type: any
    validationType?: CommandOptionValidationType
    name: string
    config: Record<Language, CommandOptionConfig>
    minValue?: number
    maxValue?: number
    minLength?: number
    maxLength?: number
    channelTypes?: Array<ChannelType>
    required: boolean
}