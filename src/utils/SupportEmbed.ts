import {EmbedBuilder, User} from "discord.js";
import Constants from "@/types/Constants";
import constants from "@/properties/constants.json";
import support from "@/properties/support.json"
const colors = (constants as Constants).colors;

export default class SupportEmbed {
    static appeal(user: User, answers: Array<string>): EmbedBuilder {
        let embed = new EmbedBuilder()
            .setColor(colors.system)
            .setAuthor({name: `${user.username} подал апелляцию бана`})
            .setFooter({text: `ID: ${user.id}`})
        for (let i in support.appeal.ru) {
            embed.addFields({
                name: support.appeal.ru[i],
                value: answers[i]
            })
        }
        return embed
    }

    static appealDM(): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(colors.system)
            .addFields([
                {
                    name: '🇷🇺 Русский',
                    value: support.appealDM.ru.replace("{{link}}", process.env.SUPPORT_SERVER)
                },
                {
                    name: '🇬🇧 English',
                    value: support.appealDM.en.replace("{{link}}", process.env.SUPPORT_SERVER)
                }
            ])
    }
}