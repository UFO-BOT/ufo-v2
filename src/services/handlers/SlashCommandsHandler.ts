import Discord, {
    ApplicationCommandOptionType,
    CommandInteraction,
    GuildMember,
    InteractionReplyOptions,
    Message,
    TextChannel
} from "discord.js";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import SlashCommandsValidator from "@/services/validators/SlashCommandsValidator";
import MakeError from "@/utils/MakeError";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import AbstractService from "@/abstractions/AbstractService";

export default class SlashCommandsHandler extends AbstractService {
    public interaction: CommandInteraction

    constructor(interaction: CommandInteraction) {
        super()
        this.interaction = interaction;
    }

    public async handle(): Promise<void> {
        type ErrorFunction = ((member: Discord.GuildMember, settings: GuildSettingsCache, options: {})
            => Discord.EmbedBuilder)

        let command = global.client.cache.commands.find(cmd =>
            cmd.config.en.name === this.interaction.commandName ||
            cmd.config.ru.name === this.interaction.commandName);
        if(!command) return;

        let settings = await GuildSettingsManager.getCache(this.interaction.guildId);
        let balance;
        if(command.options.find(op => op.validationType === CommandOptionValidationType.Bet)) {
            balance = await global.db.manager.findOneBy(Balance, {
                guildid: this.interaction.guildId,
                userid: this.interaction.user.id
            })
        }
        let validator = new SlashCommandsValidator(this.interaction.options.data, command.options, settings, balance);
        let validationResult = validator.validate();
        if(!validationResult.valid) {
            let error = MakeError[validationResult.error?.type] as ErrorFunction;
            await this.interaction.reply({embeds:
                    [validationResult.error ?
                        error(this.interaction.member as GuildMember, settings, validationResult.error.options) :
                        MakeError.validationError(this.interaction.member as GuildMember, settings,
                            validationResult.problemOption)],
                ephemeral: true
            })
            return;
        }

        let response = responses[command.config.en.name as keyof typeof responses]?.[settings.language.interface];
        if(!response) return;

        if(command.deferReply) await this.interaction.deferReply();
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
        if(result.error) {
            let errorFn = MakeError[result.error.type] as ErrorFunction;
            reply = {
                embeds: [errorFn(this.interaction.member as GuildMember, settings, result.error.options)],
                ephemeral: true
            }
        }
        let interaction = result.interaction;
        if(interaction) {
            reply = {embeds: [interaction.embed], components: [interaction.row()]}
            global.client.cache.interactions.set(interaction.id, interaction)
        }
        command.deferReply ?
            await this.interaction.editReply(reply) :
            await this.interaction.reply(reply as InteractionReplyOptions)
        let msg = await this.interaction.fetchReply()
        if(command.after) {
            await command.after(msg, result.data);
        }
        if(interaction?.lifetime) setTimeout(async () => {
            if(interaction.end && global.client.cache.interactions.has(interaction.id)) {
                await interaction.end()
                await msg.edit({embeds: [interaction.embed], components: []})
            }
            global.client.cache.interactions.delete(interaction.id)
        }, interaction.lifetime)
    }
}