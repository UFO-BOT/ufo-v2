import {ApplicationCommandOptionType, CommandInteractionOption} from "discord.js";
import CommandOption from "@/types/CommandOption";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";
import CommandValidationResult from "@/types/CommandValidationResult";
import TimeParser from "@/utils/TimeParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default class SlashCommandsValidator {
    public interactionOptions: Readonly<Array<CommandInteractionOption>>
    public commandOptions: Array<CommandOption>
    public settings: GuildSettingsCache

    constructor(interactionOptions: Readonly<Array<CommandInteractionOption>>, commandOptions: Array<CommandOption>,
                settings: GuildSettingsCache) {
        this.interactionOptions = interactionOptions;
        this.commandOptions = commandOptions;
        this.settings = settings;
    }

    public validate(): CommandValidationResult {
        let args: Record<string, any> = {};
        for(let option of this.commandOptions)  {
            let interactionOption = this.interactionOptions.find(o => o.name === option.name);
            if(!interactionOption) continue;
            let type = option.validationType ?
                CommandOptionValidationType[option.validationType] :
                ApplicationCommandOptionType[option.type]
            switch (type) {
                case "GuildMember":
                    if(!interactionOption.member && option.required) return {valid: false, problemOption: option};
                    args[option.name] = interactionOption.member
                    break;
                case "Duration":
                    let duration = TimeParser.parse(interactionOption.value as string, this.settings.language.commands)
                    if(!duration) return {valid: false, problemOption: option}
                    args[option.name] = duration;
                    break;
                case "User":
                    args[option.name] = interactionOption.user
                    break;
                case "Channel":
                    args[option.name] = interactionOption.channel;
                    break;
                case "Role":
                    args[option.name] = interactionOption.role;
                    break;
                case "Attachment":
                    args[option.name] = interactionOption.attachment;
                    break;
                default:
                    args[option.name] = interactionOption.value;
            }
        }
        return {valid: true, args: args}
    }
}