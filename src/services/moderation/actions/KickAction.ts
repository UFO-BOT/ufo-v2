import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import ModAction from "@/types/moderation/ModAction";
import ModActionExecutionResult from "@/types/moderation/ModActionExecutionResult";
import MemberModeratable from "@/utils/MemberModeratable";
import properties from "@/properties/moderation.json";
import PunishmentMessageTemplate from "@/services/templates/messages/PunishmentMessageTemplate";
import EmbedTemplate from "@/services/templates/embeds/EmbedTemplate";
import PunishmentVariable from "@/services/templates/variables/PunishmentVariable";

export default class KickAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Kick}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        const props = properties[this.settings.language?.interface ?? 'en'];

        if (!MemberModeratable(this.options.executor, this.options.member)) return {
            success: false,
            error: "noMemberPermissions"
        }
        if (!this.options.member.kickable) return {
            success: false,
            error: "noBotPermissions"
        }

        if (this.settings.boost && this.settings?.punishmentMessages?.kick?.enabled) {
            let punishment = new PunishmentVariable(null, this.options.reason)
            let template = new PunishmentMessageTemplate(this.options.member, this.options.guild,
                this.options.executor, punishment, this.settings.language.interface)
            let message = template.compile(this.settings.punishmentMessages.kick.message)
            let embedTemplate = new EmbedTemplate(template)
            let embed = embedTemplate.compile(this.settings.punishmentMessages.kick.embed)
            await this.options.member.send({content: message?.length ? message : '', embeds: embed ? [embed] : []})
                .catch(() => {})
        }
        else {
            let msg = props.dms.kick
                .replace("{{server}}", this.options.guild.name)
                .replace("{{moderator}}", this.options.executor.user.tag)
                .replace("{{reason}}", this.options.reason)
            await this.options.member.send({content: msg}).catch(() => null);
        }

        await this.options.member.kick(this.options.reason);
        return {success: true}
    }
}