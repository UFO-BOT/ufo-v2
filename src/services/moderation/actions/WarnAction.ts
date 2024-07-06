import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import ModAction from "@/types/moderation/ModAction";
import ModActionExecutionResult from "@/types/moderation/ModActionExecutionResult";
import MemberModeratable from "@/utils/MemberModeratable";

export default class WarnAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Warn}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        if(!MemberModeratable(this.options.executor, this.options.member)) return {
            success: false,
            error: "noMemberPermissions"
        }
        return {success: true}
    }
}