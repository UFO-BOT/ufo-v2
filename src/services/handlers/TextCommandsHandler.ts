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
import CommandSettings from "@/types/CommandSettings";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import SlashCommandsValidator from "@/services/validators/SlashCommandsValidator";
import MakeError from "@/utils/MakeError";
import TextCommandsValidator from "@/services/validators/TextCommandsValidator";

export default class TextCommandsHandler {
    public message: Message

    constructor(message: Message) {
        this.message = message;
    }

    public async handle(): Promise<void> {
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

        let validator = new TextCommandsValidator(args, command.options, this.message.guild, settings);
        let validationResult = await validator.validate();
        if(!validationResult.valid) {
            await this.message.reply({embeds:
                    [MakeError.validationError(this.message.member as GuildMember,
                        validationResult.problemOption, settings)]
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
            settings
        })
        let reply = result.reply as ReplyMessageOptions;
        if(!reply.allowedMentions) reply.allowedMentions = {};
        reply.allowedMentions.repliedUser = false;

        await this.message.reply(reply);
    }
}