import Discord, {
    ApplicationCommandOptionType,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember
} from "discord.js";
import CommandOption from "@/types/commands/CommandOption";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import CommandValidationResult from "@/types/commands/CommandValidationResult";
import TimeParser from "@/utils/TimeParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Balance from "@/types/database/Balance";

export default class SlashCommandsValidator {
    public interaction: CommandInteraction
    public interactionOptions: Readonly<Array<CommandInteractionOption>>
    public commandOptions: Array<CommandOption>
    public settings: GuildSettingsCache
    public balance: Balance

    constructor(interaction: Discord.CommandInteraction, interactionOptions: Readonly<Array<CommandInteractionOption>>,
                commandOptions: Array<CommandOption>, settings: GuildSettingsCache, balance?: Balance) {
        this.interaction = interaction;
        this.interactionOptions = interactionOptions;
        this.commandOptions = commandOptions;
        this.settings = settings;
        this.balance = balance;
    }

    public validate(): CommandValidationResult {
        let args: Record<string, any> = {};
        for(let option of this.commandOptions)  {
            let interactionOption = this.interactionOptions
                .find(o => o.name === option.config[this.settings.language.commands].name);
            if(!interactionOption) continue;
            let type = option.validationType ?
                CommandOptionValidationType[option.validationType] :
                ApplicationCommandOptionType[option.type]
            switch (type) {
                case "GuildMember":
                    if(!interactionOption.member && option.required) return {valid: false, problemOption: option};
                    let member = interactionOption.member as GuildMember;
                    args[option.name] = member;
                    if(member?.id === this.interaction.user.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
                    break;
                case "Duration":
                    let duration = TimeParser.parse(interactionOption.value as string, this.settings.language.commands)
                    if(!duration) return {valid: false, problemOption: option}
                    if(duration > 315360000000) return {
                        valid: false,
                        error: {type: "invalidDuration", options: {}}
                    }
                    args[option.name] = duration;
                    break;
                case "Bet":
                    option.minValue = this.settings.minBet;
                    let all = {
                        ru: /^вс[её]$/i,
                        en: /^all$/i
                    }
                    let arg = interactionOption.value as string;
                    let num = !!arg.match(all[this.settings.language.commands]) ?
                        this.balance?.balance ?? 0 : Number(arg);
                    if(isNaN(num) || num % 1 || num < this.settings.minBet) return {valid: false, problemOption: option}
                    let balance = this.balance?.balance ?? 0;
                    if(num > balance) return {
                        valid: false,
                        error: {
                            type: "notEnoughMoney",
                            options: {money: balance}
                        }
                    }
                    args[option.name] = num;
                    break;
                case "User":
                    args[option.name] = interactionOption.user
                    if(interactionOption.user?.id === this.interaction.user.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
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