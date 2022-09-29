import {ApplicationCommandOptionType, GuildMember, Guild, User, GuildBasedChannel, Role, Message} from "discord.js";
import CommandOption from "@/types/commands/CommandOption";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import CommandValidationResult from "@/types/commands/CommandValidationResult";
import Resolver from "@/utils/Resolver";
import {settings} from "cluster";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import TimeParser from "@/utils/TimeParser";
import Balance from "@/types/database/Balance";

export default class TextCommandsValidator {
    public message: Message
    public args: Array<string>
    public commandOptions: Array<CommandOption>
    public guild: Guild
    public settings: GuildSettingsCache
    public balance: Balance

    constructor(message: Message, args: Array<string>, commandOptions: Array<CommandOption>, guild: Guild,
                settings: GuildSettingsCache, balance?: Balance) {
        this.message = message;
        this.args = args;
        this.commandOptions = commandOptions;
        this.guild = guild;
        this.settings = settings;
        this.balance = balance;
    }

    public async validate(): Promise<CommandValidationResult> {
        let args: Record<string, any> = {};
        for(let i in this.commandOptions)  {
            let value;
            let option = this.commandOptions[i];
            let arg = this.args[i];
            if(!arg) {
                if(option.required) return {valid: false, problemOption: option}
                else this.args = [arg].concat(this.args)
                continue;
            }
            let type = option.validationType ?
                CommandOptionValidationType[option.validationType] :
                ApplicationCommandOptionType[option.type]
            switch (type) {
                case "GuildMember":
                    value = await Resolver.member(this.guild, arg);
                    if(value?.id === this.message.author.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
                    break;
                case "LongString":
                    value = this.args.join(" ")
                    break;
                case "Duration":
                    value = TimeParser.parse(arg, this.settings.language.commands)
                    if(value > 315360000000) return {
                        valid: false,
                        error: {type: "invalidDuration", options: {}}
                    }
                    break
                case "Bet":
                    option.minValue = this.settings.minBet;
                    let all = {
                        ru: /^вс[её]$/i,
                        en: /^all$/i
                    }
                    let num = !!arg.match(all[this.settings.language.commands]) ?
                        this.balance?.balance ?? 0 : Number(arg);
                    value = (!isNaN(num) && !(num % 1) && num >= this.settings.minBet) ? num : null
                    let balance = this.balance?.balance ?? 0;
                    if(num > balance) return {
                        valid: false,
                        error: {
                            type: "notEnoughMoney",
                            options: {money: balance}
                        }
                    }
                    break;
                case "User":
                    value = await Resolver.user(this.guild, arg)
                    if(value?.id === this.message.author.id) return {
                        valid: false,
                        error: {type: "noSelf", options: {}}
                    }
                    break;
                case "Channel":
                    let channel = await Resolver.channel(this.guild, arg);
                    if(channel && option.channelTypes.includes(channel?.type)) value = channel;
                    break;
                case "Role":
                    value = await Resolver.role(this.guild, arg);
                    break;
                case "Number": case "Integer":
                    value = Number(arg);
                    if(isNaN(value)) value = undefined;
                    if(option.type === ApplicationCommandOptionType.Integer && value % 1) value = undefined;
                    if(option.minValue && value < option.minValue) value = undefined;
                    if(option.maxValue && value < option.minValue) value = undefined;
                    break;
                case "String":
                    value = arg;
            }
            let choices = option.config[this.settings.language.commands].choices;
            if(choices) value = choices.find(c => c.name === arg)?.value;
            if(!value) {
                if(option.required) return {valid: false, problemOption: option}
                else this.args = [arg].concat(this.args)
            }
            args[option.name] = value;
        }
        return {valid: true, args: args}
    }
}