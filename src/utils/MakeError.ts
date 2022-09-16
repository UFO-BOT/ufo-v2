import {ApplicationCommandOptionType, ChannelType, EmbedBuilder, GuildMember} from "discord.js";
import Language from "@/types/Language";
import errors from "@/properties/errors.json";
import TimeParser from "@/utils/TimeParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import CommandOption from "@/types/commands/CommandOption";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

export default class MakeError {
    static validationError(member: GuildMember, settings: GuildSettingsCache, option: CommandOption): EmbedBuilder {
        let error = errors.validationError[settings.language.interface];
        let enums = error.embed.enums;
        let optionType = (option.validationType !== undefined ?
            CommandOptionValidationType[option.validationType] :
            ApplicationCommandOptionType[option.type]) as keyof typeof enums;
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description
                .replace("{{option}}", option.config[settings.language.interface].name)
                .replace("{{type}}", enums[optionType]))
        if(option.config.en.choices) {
            embed.addFields({
                name: error.embed.fields.choices,
                value: option.config[settings.language.commands].choices.map(c => c.name).join(" | "),
                inline: true
            })
        }
        if(option.minValue !== undefined) embed.addFields({
            name: error.embed.fields.minValue, value: option.minValue.toString(), inline: true
        })
        if(option.maxValue !== undefined) embed.addFields({
            name: error.embed.fields.minValue, value: option.maxValue.toString(), inline: true
        })
        if(option.minLength !== undefined) embed.addFields({
            name: error.embed.fields.minLength, value: option.minLength.toString() + ' ' + error.embed.fields.symbols,
            inline: true
        })
        if(option.maxLength !== undefined) embed.addFields({
            name: error.embed.fields.maxLength, value: option.maxLength.toString() + ' ' + error.embed.fields.symbols,
            inline: true
        })
        if(option.channelTypes?.length) embed.addFields({
            name: error.embed.fields.channelTypes,
            value: option.channelTypes.map(ct => "`" + enums[ChannelType[ct] as keyof typeof enums] + "`").join(", "),
            inline: true
        })
        return embed;
    }

    static noMemberPermissions(member: GuildMember, settings: GuildSettingsCache, perms: Array<string>): EmbedBuilder {
        let error = errors.noMemberPermissions[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description.replace("{{perms}}", perms.map(p => '`' + p + '`').join(", ")));
    }

    static userCoolDown(member: GuildMember, settings: GuildSettingsCache, options: {time: number}): EmbedBuilder {
        let error = errors.userCooldown[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description.replace("{{time}}", TimeParser.formatTimestamp(options.time, 'R')));
    }

    static notEnoughMoney(member: GuildMember, settings: GuildSettingsCache, options: {money: number}): EmbedBuilder {
        let error = errors.notEnoughMoney[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(options.money > 0 ? error.embed.description
                .replace("{{money}}", options.money.toString())
                .replace("{{moneysymb}}", settings.moneysymb) : error.embed.holdOn
            );
    }

    static invalidBet(member: GuildMember, settings: GuildSettingsCache, options: {bet: number}): EmbedBuilder {
        let error = errors.invalidBet[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description
                .replace("{{bet}}", options.bet.toString())
                .replace("{{moneysymb}}", settings.moneysymb)
            );
    }

    static interactionUnavailable(member: GuildMember, settings: GuildSettingsCache): EmbedBuilder {
        let error = errors.interactionUnavailable[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description);
    }

    static interactionNotAllowed(member: GuildMember, settings: GuildSettingsCache): EmbedBuilder {
        let error = errors.interactionNotAllowed[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description);
    }

    static other(member: GuildMember, settings: GuildSettingsCache, options: {text: string, name?: string}): EmbedBuilder {
        let error = errors.other[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: options.name ?? error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(options.text);
    }
}