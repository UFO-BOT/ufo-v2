import {ApplicationCommandOptionType, CommandInteractionOption} from "discord.js";
import CommandOption from "@/types/CommandOption";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";
import CommandValidationResult from "@/types/CommandValidationResult";

export default class SlashCommandsValidator {
    public interactionOptions: Readonly<Array<CommandInteractionOption>>
    public commandOptions: Array<CommandOption>;

    constructor(interactionOptions: Readonly<Array<CommandInteractionOption>>, commandOptions: Array<CommandOption>) {
        this.interactionOptions = interactionOptions;
        this.commandOptions = commandOptions;
    }

    public validate(): CommandValidationResult {
        let args: Record<string, any> = {};
        for(let option of this.commandOptions)  {
            let interactionOption = this.interactionOptions.find(o => o.name === option.name);
            switch (option.validationType) {
                case CommandOptionValidationType.GuildMember:
                    if(!interactionOption.member && option.required) return {valid: false, problemOption: option};
                    args[option.name] = interactionOption.member
                    break;
            }
            switch (option.type) {
                case ApplicationCommandOptionType.User:
                    args[option.name] = interactionOption.user
                    break;
                case ApplicationCommandOptionType.Channel:
                    args[option.name] = interactionOption.channel;
                    break;
                case ApplicationCommandOptionType.Role:
                    args[option.name] = interactionOption.role;
                    break;
                case ApplicationCommandOptionType.Attachment:
                    args[option.name] = interactionOption.attachment;
                    break;
                default:
                    args[option.name] = interactionOption.value;
            }
        }
        return {valid: true, args: args}
    }
}