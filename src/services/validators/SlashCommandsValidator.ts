import {
    ApplicationCommandOptionType,
    CommandInteraction,
    CommandInteractionOption, Guild,
    GuildMember
} from "discord.js";
import CommandOption from "@/types/commands/CommandOption";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import CommandValidationResult from "@/types/commands/CommandValidationResult";
import TimeParser from "@/utils/TimeParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Balance from "@/types/database/Balance";
import Resolver from "@/utils/Resolver";
import GuildSettings from "@/utils/GuildSettings";
import AbstractService from "@/abstractions/AbstractService";

interface SlashCommandsValidatorOptions {
    interaction: CommandInteraction
    interactionOptions: Readonly<Array<CommandInteractionOption>>
    commandOptions: Array<CommandOption>
    guild: Guild
    settings?: GuildSettingsCache
    balance?: Balance
}

export default class SlashCommandsValidator extends AbstractService {
    constructor(public options: SlashCommandsValidatorOptions) {
        super()
        this.options.settings = this.client.cache.settings.get(this.options.guild.id);
    }

    public async validate(): Promise<CommandValidationResult> {
        let args: Record<string, any> = {};
        for(let option of this.options.commandOptions)  {
            let interactionOption = this.options.interactionOptions
                .find(o => o.name === option.config[this.options.settings.language.commands].name);
            if(!interactionOption) continue;
            let type = option.validationType ?
                CommandOptionValidationType[option.validationType] :
                ApplicationCommandOptionType[option.type]
            switch (type) {
                case "GuildMember":
                    let member = interactionOption.member as GuildMember;
                    args[option.name] = member;
                    if(option.noSelf && member?.id === this.options.interaction.user.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
                    break;
                case "Duration":
                    let duration = TimeParser.parse(interactionOption.value as string, this.options.settings.language.commands)
                    if(duration > 315360000000) return {
                        valid: false,
                        error: {type: "invalidDuration", options: {}}
                    }
                    args[option.name] = duration;
                    break;
                case "Bet":
                    option.minValue = this.options.settings.minBet;
                    let all = {
                        ru: /^вс[её]$/i,
                        en: /^all$/i
                    }
                    let arg = interactionOption.value as string;
                    let num = !!(arg.match(all.en) || arg.match(all.ru)) ?
                        this.options.balance?.balance ?? 0 : Number(arg);
                    if(isNaN(num) || num % 1 || num < this.options.settings.minBet) num = undefined;
                    let balance = this.options.balance?.balance ?? 0;
                    if(num > balance) return {
                        valid: false,
                        error: {
                            type: "notEnoughMoney",
                            options: {money: balance}
                        }
                    }
                    args[option.name] = num;
                    break;
                case "Ban":
                    args[option.name] = await Resolver.ban(this.options.guild, interactionOption.value as string);
                    break;
                case "User":
                    args[option.name] = interactionOption.user
                    if(option.noSelf && interactionOption.user?.id === this.options.interaction.user.id) return {
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
            if(args[option.name] === undefined && option.required) return {valid: false, problemOption: option};
        }
        return {valid: true, args: args}
    }
}