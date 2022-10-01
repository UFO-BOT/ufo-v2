import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOptionType, ChannelType,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
    InteractionReplyOptions, Message, ReplyMessageOptions,
    TextChannel
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import SlashCommandsValidator from "@/services/validators/SlashCommandsValidator";
import MakeError from "@/utils/MakeError";
import TextCommandsValidator from "@/services/validators/TextCommandsValidator";
import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import PermissionsParser from "@/utils/PermissionsParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import AbstractService from "@/abstractions/AbstractService";
import SetInteraction from "@/utils/SetInteraction";

export default class TextCommandsHandler extends AbstractService {
    public message: Message

    constructor(message: Message) {
        super()
        this.message = message;
    }

    public async handle(): Promise<void> {
        type ErrorFunction = ((member: Discord.GuildMember, settings: GuildSettingsCache, options: {})
            => Discord.EmbedBuilder)

        if (this.message.channel.type !== ChannelType.GuildText &&
            this.message.channel.type !== ChannelType.GuildNews) return;

        let settings = await GuildSettingsManager.getCache(this.message.guildId)

        let messageArray = this.message.content.split(' ')
        while (messageArray.includes('')) {
            messageArray.splice(messageArray.indexOf(''), 1);
        }
        let cmd = messageArray[0].toLowerCase()
        if (!cmd.startsWith(settings.prefix)) return;
        let args = messageArray.slice(1);

        let command = global.client.cache.commands.find(c =>
                c.config[settings?.language?.commands ?? 'en'].name === cmd.slice(settings.prefix.length) ||
            c.config[settings?.language?.commands ?? 'en'].aliases.includes(cmd.slice(settings.prefix.length)))
        if(!command) return;

        if(command.boostRequired && !settings.boost) {
            await this.message.reply({
                embeds: [MakeError.boostRequired(this.message.member, settings)],
                allowedMentions: {repliedUser: false}
            })
            return;
        }

        if(command.defaultMemberPermissions) {
            if(!this.message.member.permissions.has(command.defaultMemberPermissions)) {
                await this.message.reply({embeds:
                        [MakeError.noMemberPermissions(this.message.member as GuildMember, settings,
                            PermissionsParser.parse(command.defaultMemberPermissions, settings.language.interface))],
                    allowedMentions: {repliedUser: false}
                })
                return;
            }
        }

        let balance;
        if(command.options.find(op => op.validationType === CommandOptionValidationType.Bet)) {
            balance = await global.db.manager.findOneBy(Balance, {
                guildid: this.message.guildId,
                userid: this.message.author.id
            })
        }
        let validator = new TextCommandsValidator(this.message, args, command.options, this.message.guild, settings, balance);
        let validationResult = await validator.validate();
        if(!validationResult.valid) {
            let error = MakeError[validationResult.error?.type] as ErrorFunction;
            await this.message.reply({embeds:
                    [validationResult.error ?
                        error(this.message.member as GuildMember, settings, validationResult.error.options) :
                        MakeError.validationError(this.message.member as GuildMember, settings,
                            validationResult.problemOption)],
                allowedMentions: {repliedUser: false}
            })
            return;
        }

        let response = responses[command.config.en.name as keyof typeof responses]?.[settings.language.interface];
        if(!response) return;

        let result = await command.execute({
            guild: this.message.guild,
            member: this.message.member,
            channel: this.message.channel,
            args: validationResult.args,
            response: new PropertyParser(response),
            settings,
            balance
        })
        let reply = result.reply as ReplyMessageOptions;
        if(result.error) {
            let errorFn = MakeError[result.error.type] as ErrorFunction;
            reply = {embeds: [errorFn(this.message.member as GuildMember, settings, result.error.options)]}
        }
        let interaction = result.interaction;
        if(interaction) reply = {embeds: [interaction.embed], components: [interaction.row()]};
        if(!reply.allowedMentions) reply.allowedMentions = {};
        reply.allowedMentions.repliedUser = false;

        let msg = await this.message.reply(reply);
        if(command.after) await command.after(msg, result.data);
        if(interaction) SetInteraction(this.client, interaction, msg);
    }
}