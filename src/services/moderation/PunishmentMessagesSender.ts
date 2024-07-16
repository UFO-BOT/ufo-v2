import AbstractService from "@/abstractions/AbstractService";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import Settings from "@/types/database/Settings";
import PunishmentVariable from "@/services/templates/variables/PunishmentVariable";
import PunishmentMessageTemplate from "@/services/templates/messages/PunishmentMessageTemplate";
import EmbedTemplate from "@/services/templates/embeds/EmbedTemplate";
import properties from "@/properties/moderation.json";
import TimeParser from "@/utils/TimeParser";

export default class PunishmentMessagesSender extends AbstractService {
    constructor(public settings: Settings, public options: ModerationActionOptions) {
        super();
    }

    public async execute(): Promise<any> {
        const lang = this.settings.language?.interface ?? 'en'
        const props = properties[lang];
        const type = this.options.action as 'kick' | 'ban'
        if (this.settings.boost && this.settings?.punishmentMessages?.[type]?.enabled) {
            let punishment = new PunishmentVariable(this.options.duration ?? null, this.options.reason)
            let template = new PunishmentMessageTemplate(this.options.member, this.options.guild,
                this.options.executor, punishment, lang)
            let message = template.compile(this.settings.punishmentMessages?.[type]?.message)
            let embedTemplate = new EmbedTemplate(template)
            let embed = embedTemplate.compile(this.settings.punishmentMessages?.[type]?.embed)
            await this.options.member.send({content: message?.length ? message : '', embeds: embed ? [embed] : []})
                .catch(() => {})
        }
        else {
            let msg = props.dms[type]
                .replace("{{server}}", this.options.guild.name)
                .replace("{{moderator}}", this.options.executor.user.tag)
                .replace("{{reason}}", this.options.reason)
            if (this.options.duration) msg += '\n' + props.dms.duration
                .replace("{{duration}}", TimeParser.stringify(this.options.duration, lang))
            await this.options.member.send({content: msg}).catch(() => null);
        }
    }
}