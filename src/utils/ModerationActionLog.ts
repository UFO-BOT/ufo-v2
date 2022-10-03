import {ColorResolvable, EmbedBuilder} from "discord.js";
import Case from "@/types/database/Case";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import properties from "@/properties/moderation.json";
import TimeParser from "@/utils/TimeParser";
import Client from "@/structures/Client";

export default async function ModerationActionLog(client: Client, action: Case, settings: GuildSettingsCache): Promise<EmbedBuilder> {
    let user = await client.users.fetch(action.userid);
    let executor = await client.users.fetch(action.executor)
    const props = properties[settings.language.interface];
    let logEmbed = new EmbedBuilder()
        .setColor(props.actions[action.action].color as ColorResolvable)
        .setAuthor({
            name: props.actions[action.action].log + ' ' + user.tag,
            iconURL: user.displayAvatarURL()
        })
        .addFields([
            {
                name: props.user,
                value: user.toString(),
                inline: true
            },
            {
                name: props.moderator,
                value: executor.toString(),
                inline: true
            }
        ])
    if (action.duration) logEmbed.addFields({
        name: props.duration,
        value: TimeParser.stringify(action.duration, settings.language.interface),
        inline: true
    })
    if (action.reason) logEmbed.addFields({
        name: props.reason,
        value: action.reason
    })
    logEmbed
        .setFooter({text: `${props.case} #${action.number}`})
        .setTimestamp()
    return logEmbed;
}