import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModAction from "@/types/ModAction";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";
import MemberModeratable from "@/utils/MemberModeratable";
import properties from "@/properties/moderation.json";

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

        let msg = props.dms.kick
            .replace("{{server}}", this.options.guild.name)
            .replace("{{moderator}}", this.options.executor.user.tag)
            .replace("{{reason}}", this.options.reason)
        await this.options.member.send({content: msg}).catch(() => null);

        await this.options.member.kick(this.options.reason);
        return {success: true}
    }
}