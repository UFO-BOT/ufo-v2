import {ApplicationCommandOptionType, ChannelType, EmbedBuilder, GuildMember} from "discord.js";
import Language from "@/types/Language";
import errors from "@/properties/errors.json";
import TimeParser from "@/utils/TimeParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import CommandOption from "@/types/CommandOption";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";

export default class MakeError {
    static validationError(member: GuildMember, option: CommandOption, settings: GuildSettingsCache): EmbedBuilder {
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

    static userCoolDown(member: GuildMember, time: number, settings: GuildSettingsCache): EmbedBuilder {
        let error = errors.userCooldown[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description.replace("{{time}}", `<t:${Math.floor(time/1000)}:R>`));
    }

    static notEnoughMoney(member: GuildMember, money: number, settings: GuildSettingsCache): EmbedBuilder {
        let error = errors.notEnoughMoney[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description
                .replace("{{money}}", money.toString())
                .replace("{{moneysymb}}", settings.moneysymb)
            );
    }

    static other(member: GuildMember, settings: GuildSettingsCache, text: string, name?: string): EmbedBuilder {
        let error = errors.other[settings.language.interface];
        return new EmbedBuilder()
            .setColor(global.constants.colors.error)
            .setAuthor({name: name ?? error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(text);
    }
}