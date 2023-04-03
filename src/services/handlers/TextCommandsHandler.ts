import Discord, {
    ApplicationCommandOptionType,
    ChannelType,
    GuildMember,
    Message,
    BaseMessageOptions, EmbedBuilder
} from "discord.js";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import MakeError from "@/utils/MakeError";
import TextCommandsValidator from "@/services/validators/TextCommandsValidator";
import PermissionsParser from "@/utils/PermissionsParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import AbstractService from "@/abstractions/AbstractService";
import SetInteraction from "@/utils/SetInteraction";
import GuildSettings from "@/utils/GuildSettings";

export default class TextCommandsHandler extends AbstractService {
    constructor(public message: Message) {
        super()
    }

    public async handle(): Promise<any> {
        type ErrorFunction = ((member: Discord.GuildMember, settings: GuildSettingsCache, options: {})
            => Discord.EmbedBuilder)

        if (this.message.channel.type !== ChannelType.GuildText &&
            this.message.channel.type !== ChannelType.GuildNews) return;

        let settings = await GuildSettings.getCache(this.message.guildId);

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
        if (!command) return;

        let commandSettings = settings.commandsSettings[command.config.en.name];
        if(commandSettings?.enabled === false) return;

        if (command.boostRequired && !settings.boost)
            return this.reply(MakeError.boostRequired(this.message.member, settings))

        if(!this.message.member.permissions.has("Administrator")) {
            if(commandSettings?.allowedRoles?.length) {
                if(!commandSettings.allowedRoles.find(r => this.message.member.roles.cache.has(r)))
                    return this.reply(MakeError.certainRoles(this.message.member, settings))
            }
            else if(command.defaultMemberPermissions) {
                if(this.message.member.permissions.has(command.defaultMemberPermissions))
                    return this.reply(MakeError.noMemberPermissions(this.message.member as GuildMember, settings,
                        PermissionsParser.parse(command.defaultMemberPermissions, settings.language.interface)))
            }
            if(commandSettings?.forbiddenRoles?.find(r => this.message.member.roles.cache.has(r)))
                return this.reply(MakeError.certainRoles(this.message.member, settings))
            if((commandSettings?.allowedChannels?.length &&
                    !commandSettings?.allowedChannels?.includes(this.message.channel.id)) ||
                commandSettings?.forbiddenChannels?.includes(this.message.channel.id))
                return this.reply(MakeError.certainChannels(this.message.member, settings))
        }


        if (command.botPermissions && !this.message.guild.members.me.permissions.has(command.botPermissions ?? []))
            return this.reply(MakeError.noBotPermissions(this.message.member as GuildMember, settings,
                PermissionsParser.parse(command.botPermissions, settings.language.interface)))

        let balance;
        if (command.options.find(op => op.validationType === CommandOptionValidationType.Bet)) {
            balance = await global.db.manager.findOneBy(Balance, {
                guildid: this.message.guildId,
                userid: this.message.author.id
            })
        }

        let validator = new TextCommandsValidator({
            message: this.message,
            args,
            commandOptions: command.options,
            guild: this.message.guild,
            balance
        });
        let validationResult = await validator.validate();
        if (!validationResult.valid) {
            let error = MakeError[validationResult.error?.type] as ErrorFunction;
            return this.reply(validationResult.error ?
                error(this.message.member as GuildMember, settings, validationResult.error.options) :
                MakeError.validationError(this.message.member as GuildMember, settings,
                    validationResult.problemOption))
        }

        let response = responses[command.config.en.name as keyof typeof responses]?.[settings.language.interface];
        if (!response) return;

        if(commandSettings.deleteUsage) await this.message.delete().catch(() => {})

        let result = await command.execute({
            guild: this.message.guild,
            member: this.message.member,
            channel: this.message.channel,
            args: validationResult.args,
            response: new PropertyParser(response),
            settings,
            balance
        })
        let reply = result.reply as BaseMessageOptions;
        if (result.error) {
            let errorFn = MakeError[result.error.type] as ErrorFunction;
            reply = {embeds: [errorFn(this.message.member as GuildMember, settings, result.error.options)]}
        }
        let interaction = result.interaction;
        if (interaction) reply = {embeds: [interaction.embed], components: [interaction.row()]};
        if (!reply.allowedMentions) reply.allowedMentions = {};
        reply.allowedMentions.repliedUser = false;

        let msg = commandSettings.deleteUsage ? await this.message.channel.send(reply) : await this.message.reply(reply);
        if (command.after) await command.after(msg, result.data);
        if (interaction) SetInteraction(this.client, interaction, msg);
    }

    private async reply(embed: EmbedBuilder): Promise<Message> {
        return this.message.reply({
            embeds: [embed],
            allowedMentions: {repliedUser: false}
        })
    }
}