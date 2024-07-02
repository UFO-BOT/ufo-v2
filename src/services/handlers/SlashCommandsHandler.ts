import Discord, {
    ApplicationCommandOptionType,
    CommandInteraction,
    GuildMember,
    InteractionReplyOptions,
    TextChannel
} from "discord.js";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import SlashCommandsValidator from "@/services/validators/SlashCommandsValidator";
import MakeError from "@/utils/MakeError";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import AbstractService from "@/abstractions/AbstractService";
import SetInteraction from "@/utils/SetInteraction";
import PermissionsParser from "@/utils/PermissionsParser";
import GuildSettings from "@/utils/GuildSettings";

export default class SlashCommandsHandler extends AbstractService {
    constructor(public interaction: CommandInteraction) {
        super()
    }

    public async handle(): Promise<any> {
        type ErrorFunction = ((member: Discord.GuildMember, settings: GuildSettingsCache, options: {})
            => Discord.EmbedBuilder)

        let command = global.client.cache.commands.find(cmd =>
            cmd.config.en.name === this.interaction.commandName ||
            cmd.config.ru.name === this.interaction.commandName);
        if (!command) return;

        let settings = await GuildSettings.getCache(this.interaction.guildId);

        let commandSettings = settings.commandsSettings[command.config.en.name];
        if(commandSettings?.enabled === false) return this.interaction.reply({
            embeds: [MakeError.commandDisabled(this.interaction.member as GuildMember, settings)],
            ephemeral: true
        })

        if (command.boostRequired && !settings.boost) return this.interaction.reply({
            embeds: [MakeError.boostRequired(this.interaction.member as GuildMember, settings)],
            ephemeral: true
        })

        if (command.botPermissions && !this.interaction.guild.members.me.permissions.has(command.botPermissions ?? []))
            return this.interaction.reply({
                embeds:
                    [MakeError.noBotPermissions(this.interaction.member as GuildMember, settings,
                        PermissionsParser.parse(command.botPermissions, settings.language.interface))]
            })

        let balance;
        if (command.options.find(op => op.validationType === CommandOptionValidationType.Bet)) {
            balance = await global.db.manager.findOneBy(Balance, {
                guildid: this.interaction.guildId,
                userid: this.interaction.user.id
            })
        }

        let validator = new SlashCommandsValidator({
            interaction: this.interaction,
            interactionOptions: this.interaction.options.data,
            commandOptions: command.options,
            guild: this.interaction.guild,
            balance
        });
        let validationResult = await validator.validate();
        if (!validationResult.valid) {
            let error = MakeError[validationResult.error?.type] as ErrorFunction;
            return this.interaction.reply({
                embeds:
                    [validationResult.error ?
                        error(this.interaction.member as GuildMember, settings, validationResult.error.options) :
                        MakeError.validationError(this.interaction.member as GuildMember, settings,
                            validationResult.problemOption)],
                ephemeral: true
            })
        }

        let response = responses[command.config.en.name as keyof typeof responses]?.[settings.language.interface];
        if (!response) return;

        if (command.deferReply) await this.interaction.deferReply();
        let context: CommandExecutionContext = {
            guild: this.interaction.guild,
            member: this.interaction.member as GuildMember,
            channel: this.interaction.channel as TextChannel,
            args: validationResult.args,
            response: new PropertyParser(response),
            settings,
            balance
        }
        let result = await command.execute(context);
        let reply = result.reply;
        if (result.error) {
            let errorFn = MakeError[result.error.type] as ErrorFunction;
            reply = {
                embeds: [errorFn(this.interaction.member as GuildMember, settings, result.error.options)],
                ephemeral: true
            }
        }
        let interaction = result.interaction;
        if (interaction) reply = {embeds: [interaction.embed], components: [interaction.row()]};
        command.deferReply ?
            await this.interaction.editReply(reply) :
            await this.interaction.reply(reply as InteractionReplyOptions)
        let msg = await this.interaction.fetchReply()
        if (command.after) {
            await command.after(msg, result.data);
        }
        if (interaction) SetInteraction(this.client, interaction, msg);
    }
}