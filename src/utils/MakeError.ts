import {EmbedBuilder, GuildMember} from "discord.js";
import Language from "@/types/Language";
import errors from "@/properties/errors.json";
import TimeParser from "@/utils/TimeParser";

export default class MakeError {
    static userCoolDown(member: GuildMember, time: number, lang: Language): EmbedBuilder {
        let error = errors.userCooldown[lang];
        return new EmbedBuilder()
            .setColor(process.env.SYSTEM_COLOR)
            .setAuthor({name: error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(error.embed.description.replace("{{time}}", `<t:${Math.floor(time/1000)}:R>`));
    }

    static other(member: GuildMember, lang: Language, text: string, name?: string): EmbedBuilder {
        let error = errors.other[lang];
        return new EmbedBuilder()
            .setColor("#ff0621")
            .setAuthor({name: name ?? error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(text);
    }
}