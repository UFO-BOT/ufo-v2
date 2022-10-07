import AbstractService from "@/abstractions/AbstractService";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import Case from "@/types/database/Case";
import properties from "@/properties/moderation.json";
import Settings from "@/types/database/Settings";
import {ColorResolvable, EmbedBuilder, GuildTextBasedChannel} from "discord.js";
import TimeParser from "@/utils/TimeParser";
import actionExecutionResult from "@/types/ModActionExecutionResult";
import MakeError from "@/utils/MakeError";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import ModerationActionLog from "@/utils/ModerationActionLog";
import ModAction from "@/types/ModAction";

export default abstract class ModerationAction extends AbstractService {
    public settings: Settings

    protected constructor(public options: ModerationActionOptions) {
        super();
    }

    public async execute(): Promise<EmbedBuilder> {
        this.settings = await this.db.manager.findOneBy(Settings, {guildid: this.options.guild.id});
        if(!this.settings) {
            this.settings = new Settings()
            this.settings.guildid = this.options.guild.id;
        }
        let lang = this.settings.language?.interface ?? "en";
        const props = properties[lang];

        let action = new Case();
        let cases = await this.db.mongoManager.createCursor(Case, {guildid: this.options.guild.id})
            .sort({number: -1})
            .limit(1)
            .toArray();
        this.options.number = (cases[0]?.number ?? 0) + 1;

        let result = await this.action();
        if(!result.success) {
            let errors = props.actions[this.options.action].errors as Record<string, string>;
            return !this.options.autoMod ?
                MakeError.other(this.options.member, GuildSettingsManager.toCache(this.settings), {
                    text: errors[result.error]
                }) : null
        }

        let reason = this.options.reason?.length ? this.options.reason : props.notSpecified;
        let ends = this.options.duration ? ` | ${props.ends}` : '';
        action.guildid = this.options.guild.id;
        action.userid = this.options.user.id;
        action.action = this.options.action;
        action.number = this.options.number;
        action.executor = this.options.executor.id;
        action.reason = reason;
        action.timestamp = Date.now();
        action.duration = this.options.duration ?? null;
        await this.db.manager.save(action);
        let logEmbed = await ModerationActionLog(this.client, action, GuildSettingsManager.toCache(this.settings));
        let channel = this.options.guild.channels.cache.get(this.settings?.logs?.channels?.moderation) as GuildTextBasedChannel;
        if (channel) await channel.send({embeds: [logEmbed]});
        let embed = new EmbedBuilder()
            .setColor(props.actions[this.options.action].color as ColorResolvable)
            .setAuthor({
                name: `${props.case} #${this.options.number} | ${this.options.member.user.tag} ${props.actions[this.options.action].author}`,
                iconURL: this.options.member.displayAvatarURL()
            })
            .setFooter({text: `${props.moderator} ${this.options.executor.user.tag}` + ends})
            .setTimestamp(Date.now() + (this.options.duration ?? 0))
        if(this.options.action !== ModAction.Unmute && this.options.action !== ModAction.Unban)
            embed.setDescription(`**${props.reason}:** ${reason}`)
        if (this.options.duration) embed.addFields({
            name: props.duration,
            value: TimeParser.stringify(this.options.duration, lang)
        })
        return embed;
    }

    public abstract action(): Promise<actionExecutionResult>
}
