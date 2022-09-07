import {ApplicationCommandOptionChoiceData} from "discord.js";

export default interface CommandOptionConfig {
    name: string
    description: string
    choices?: Array<ApplicationCommandOptionChoiceData<string>>
}