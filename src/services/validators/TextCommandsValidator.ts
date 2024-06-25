import {
    ApplicationCommandOptionType,
    GuildMember,
    Guild,
    User,
    GuildBasedChannel,
    Role,
    Message,
    CommandInteraction, CommandInteractionOption
} from "discord.js";
import CommandOption from "@/types/commands/CommandOption";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import CommandValidationResult from "@/types/commands/CommandValidationResult";
import Resolver from "@/utils/Resolver";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import TimeParser from "@/utils/TimeParser";
import Balance from "@/types/database/Balance";
import AbstractService from "@/abstractions/AbstractService";

interface TextCommandsValidatorOptions {
    message: Message
    args: Array<string>
    commandOptions: Array<CommandOption>
    guild: Guild
    settings?: GuildSettingsCache
    balance?: Balance
}

export default class TextCommandsValidator extends AbstractService {
    constructor(public options: TextCommandsValidatorOptions) {
        super()
        this.options.settings = this.client.cache.settings.get(this.options.guild.id);
    }

    public async validate(): Promise<CommandValidationResult> {
        let args: Record<string, any> = {};
        for(let i in this.options.commandOptions)  {
            let value;
            let option = this.options.commandOptions[i];
            let arg = this.options.args[i];
            let type = option.validationType ?
                CommandOptionValidationType[option.validationType] :
                ApplicationCommandOptionType[option.type]
            if(!arg && type !== "Attachment") {
                if(option.required) return {valid: false, problemOption: option}
                else this.options.args = [arg].concat(this.options.args)
                continue;
            }
            switch (type) {
                case "GuildMember":
                    value = await Resolver.member(this.options.guild, arg);
                    if(option.noSelf && value?.id === this.options.message.author.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
                    break;
                case "LongString":
                    value = this.options.args.slice(Number(i)).join(" ")
                    if(option.minLength !== undefined && value?.length < option.minLength) value = undefined;
                    if(option.maxLength !== undefined && value?.length > option.maxLength) value = undefined;
                    break;
                case "Duration":
                    value = TimeParser.parse(arg, this.options.settings.language.commands)
                    if(value < 1000 || value > 315360000000) return {
                        valid: false,
                        error: {type: "invalidDuration", options: {}}
                    }
                    break
                case "Bet":
                    option.minValue = this.options.settings.minBet;
                    let all = {
                        ru: /^вс[её]$/i,
                        en: /^all$/i
                    }
                    let num = !!(arg.match(all.en) || arg.match(all.ru)) ?
                        this.options.balance?.balance ?? 0 : Number(arg);
                    value = (!isNaN(num) && !(num % 1) && num >= this.options.settings.minBet) ? num : undefined
                    let balance = this.options.balance?.balance ?? 0;
                    if(num > balance) return {
                        valid: false,
                        error: {
                            type: "notEnoughMoney",
                            options: {money: balance}
                        }
                    }
                    break;
                case "Ban":
                    value = await Resolver.ban(this.options.guild, arg);
                    break;
                case "User":
                    value = await Resolver.user(this.options.guild, arg)
                    if(option.noSelf && value?.id === this.options.message.author.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
                    break;
                case "Channel":
                    let channel = await Resolver.channel(this.options.guild, arg);
                    if(channel && option.channelTypes.includes(channel?.type)) value = channel;
                    break;
                case "Role":
                    value = await Resolver.role(this.options.guild, arg);
                    break;
                case "Number": case "Integer":
                    value = Number(arg);
                    if(option.type === ApplicationCommandOptionType.Integer && value % 1) value = undefined;
                    if(option.minValue !== undefined && value < option.minValue) value = undefined;
                    if(option.maxValue !== undefined && value > option.maxValue) value = undefined;
                    break;
                case "String":
                    value = arg;
                    if(option.minLength !== undefined && value?.length < option.minLength) value = undefined;
                    if(option.maxLength !== undefined && value?.length > option.maxLength) value = undefined;
                    break;
                case "Attachment":
                    value = this.options.message.attachments.first()
            }
            let choices = option.config[this.options.settings.language.commands].choices;
            if(choices) value = choices.find(c => c.name === arg)?.value;
            if(value === undefined) {
                if(option.required) return {valid: false, problemOption: option}
                else this.options.args = [arg].concat(this.options.args)
            }
            else if(type === "Attachment") this.options.args = [arg].concat(this.options.args)
            args[option.name] = value;
        }
        return {valid: true, args: args}
    }
}