import AbstractService from "@/abstractions/AbstractService";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import Case from "@/types/database/Case";
import properties from "@/properties/moderation.json";
import Settings from "@/types/database/Settings";
import {ColorResolvable, EmbedBuilder, TextChannel} from "discord.js";
import TimeParser from "@/utils/TimeParser";
import ModActionExecutionResult from "@/types/moderation/ModActionExecutionResult";
import MakeError from "@/utils/MakeError";
import GuildSettings from "@/utils/GuildSettings";
import ModerationActionLog from "@/utils/ModerationActionLog";
import ModAction from "@/types/moderation/ModAction";
import {GuildLogType} from "@/types/GuildLog";

export default abstract class ModerationAction extends AbstractService {
    public settings: Settings

    protected constructor(public options: ModerationActionOptions) {
        super();
    }

    public async execute(): Promise<EmbedBuilder> {
        let settingsCache = await GuildSettings.getCache(this.options.guild.id)
        let lang = settingsCache?.language?.interface ?? "en";
        const props = properties[lang];
        if (this.client.cache.executing.moderation.has(this.options.guild.id))
            return !this.options.autoMod ?
                MakeError.other(this.options.executor, GuildSettings.toCache(this.settings), {
                    text: props.alreadyExecuting
                }) : null

        this.client.cache.executing.moderation.add(this.options.guild.id)
        this.settings = await this.db.manager.findOneBy(Settings, {guildid: this.options.guild.id});
        if (!this.settings) {
            this.settings = new Settings()
            this.settings.guildid = this.options.guild.id;
        }
        if (!this.options.member)
            this.options.member = await this.options.guild.members.fetch(this.options.user).catch(() => null)

        let action = new Case();
        let cases = await this.db.mongoManager.createCursor(Case, {guildid: this.options.guild.id})
            .sort({number: -1})
            .limit(1)
            .toArray();
        this.options.number = (cases[0]?.number ?? 0) + 1;
        this.options.reason = this.options.reason?.length ? this.options.reason : props.notSpecified;
        if (this.options.action === ModAction.Unmute || this.options.action === ModAction.Unban)
            this.options.reason = undefined

        let result = await this.action();
        if (!result.success) {
            let errors = props.actions[this.options.action].errors as Record<string, string>;
            this.client.cache.executing.moderation.delete(this.options.guild.id)
            return !this.options.autoMod ?
                MakeError.other(this.options.executor, GuildSettings.toCache(this.settings), {
                    text: errors[result.error]
                }) : null
        }

        let ends = this.options.duration ? ` | ${props.ends}` : '';
        action.guildid = this.options.guild.id;
        action.userid = this.options.user.id;
        action.action = this.options.action;
        action.number = this.options.number;
        action.executor = this.options.executor.id;
        action.reason = this.options.reason;
        action.timestamp = Date.now();
        action.duration = this.options.duration ?? null;
        await this.db.manager.save(action);
        let logEmbed = await ModerationActionLog(this.client, action, GuildSettings.toCache(this.settings));
        let channel = this.options.guild.channels.cache
            .get(this.settings?.logs?.list?.[props.logs[this.options.action] as GuildLogType]?.channel) as
            TextChannel
        if (channel) await channel.send({embeds: [logEmbed]});
        let embed = new EmbedBuilder()
            .setColor(props.actions[this.options.action].color as ColorResolvable)
            .setAuthor({
                name: `${props.case} #${this.options.number} | ${this.options.user.tag} ${props.actions[this.options.action].author}`,
                iconURL: this.options.user.displayAvatarURL()
            })
            .setFooter({text: `${props.moderator} ${this.options.executor.user.tag}` + ends})
            .setTimestamp(Date.now() + (this.options.duration ?? 0))
        if (this.options.action !== ModAction.Unmute && this.options.action !== ModAction.Unban)
            embed.setDescription(`**${props.reason}:** ${this.options.reason}`)
        if (this.options.duration) embed.addFields({
            name: props.duration,
            value: TimeParser.stringify(this.options.duration, lang)
        })
        if (this.options.autoMod) embed.data.author.name = props.autoMod + ' ' + embed.data.author.name
        this.client.cache.executing.moderation.delete(this.options.guild.id)

        return embed;
    }

    public abstract action(): Promise<ModActionExecutionResult>
}
