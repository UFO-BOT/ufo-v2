import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModAction from "@/types/ModAction";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";
import MemberModeratable from "@/utils/MemberModeratable";

export default class KickAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Kick}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        if (!MemberModeratable(this.options.executor, this.options.member)) return {
            success: false,
            error: "noMemberPermissions"
        }
        if (!this.options.member.kickable) return {
            success: false,
            error: "noBotPermissions"
        }
        await this.options.member.kick(this.options.reason);
        return {success: true}
    }
}