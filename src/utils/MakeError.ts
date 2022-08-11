import {EmbedBuilder, GuildMember} from "discord.js";
import Language from "@/types/Language";
import errors from "@/properties/errors.json";

export default class MakeError {
    static other(member: GuildMember, lang: Language, text: string, name?: string): EmbedBuilder {
        let error = errors.other[lang];
        return new EmbedBuilder()
            .setColor("#ff0621")
            .setAuthor({name: name ?? error.embed.author, iconURL: member.displayAvatarURL()})
            .setDescription(text);
    }
}