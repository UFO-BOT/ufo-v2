import AbstractService from "@/abstractions/AbstractService";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import Case from "@/types/database/Case";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import properties from "@/properties/moderation.json";
import Settings from "@/types/database/Settings";
import {ColorResolvable, EmbedBuilder, GuildTextBasedChannel} from "discord.js";
import TimeParser from "@/utils/TimeParser";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";
import MakeError from "@/utils/MakeError";
import GuildSettingsManager from "@/utils/GuildSettingsManager";

export default abstract class ModerationAction extends AbstractService {
    public settings: Settings

    protected constructor(public options: ModerationActionOptions) {
        super();
    }

    public async execute(): Promise<EmbedBuilder> {
        this.settings = await this.db.manager.findOneBy(Settings, {guildid: this.options.guild.id});
        let lang = this.settings?.language?.interface ?? "en";
        const props = properties[lang];

        let result = await this.action();
        if(!result.success) {
            let errors = props.actions[this.options.action].errors as Record<string, string>;
            return this.options.autoMod ?
                MakeError.other(this.options.member, GuildSettingsManager.toCache(this.settings), {
                    text: errors[result.error]
            }) : null
        }

        let modAction = new Case();
        let cases = await this.db.mongoManager.createCursor(Case, {guildid: this.options.guild.id})
            .sort({number: -1})
            .limit(1)
            .toArray();
        let number = (cases[0]?.number ?? 0) + 1;
        let reason = this.options.reason?.length ? this.options.reason : props.notSpecified;
        let ends = this.options.duration ? ` | ${props.ends}` : '';
        modAction.guildid = this.options.guild.id;
        modAction.userid = this.options.user.id;
        modAction.action = this.options.action;
        modAction.number = number;
        modAction.executor = this.options.executor.id;
        modAction.reason = reason;
        modAction.timestamp = Date.now();
        modAction.duration = this.options.duration ?? null;
        await this.db.manager.save(modAction);
        let logEmbed = new EmbedBuilder()
            .setColor(props.actions[this.options.action].color as ColorResolvable)
            .setAuthor({
                name: props.actions[this.options.action] + ' ' + this.options.member.user.tag,
                iconURL: this.options.member.displayAvatarURL()
            })
            .setDescription(`**${props.reason}:** ${reason}`)
            .addFields([
                {
                    name: props.user,
                    value: this.options.user.toString(),
                    inline: true
                },
                {
                    name: props.moderator,
                    value: this.options.executor.toString(),
                    inline: true
                }
            ])
        if (this.options.duration) logEmbed.addFields({
            name: props.duration,
            value: TimeParser.stringify(this.options.duration, lang),
            inline: true
        })
        logEmbed.addFields({
            name: props.reason,
            value: reason
        })
            .setFooter({text: `${props.case} #${number}`})
            .setTimestamp()

        let channel = this.options.guild.channels.cache.get(this.settings?.logs?.channels?.moderation) as GuildTextBasedChannel;
        if (channel) await channel.send({embeds: [logEmbed]});
        let embed = new EmbedBuilder()
            .setColor(props.actions[this.options.action].color as ColorResolvable)
            .setAuthor({
                name: `${props.case} #${number} | ${this.options.member.user.tag} ${props.actions[this.options.action].author}`,
                iconURL: this.options.member.displayAvatarURL()
            })
            .setDescription(`**${props.reason}:** ${reason}`)
            .setFooter({text: `${props.moderator} ${this.options.executor.user.tag}` + ends})
            .setTimestamp(Date.now() + (this.options.duration ?? 0))
        if (this.options.duration) embed.addFields({
            name: props.duration,
            value: TimeParser.stringify(this.options.duration, lang)
        })
        return embed;
    }

    public abstract action(): Promise<ModActionExecutionResult>
}
