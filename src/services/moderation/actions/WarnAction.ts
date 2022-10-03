import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModAction from "@/types/ModAction";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";

export default class WarnAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Warn}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        if((this.options.guild.ownerId !== this.options.member.id) &&
            this.options.member.roles.highest.position >= this.options.executor.roles.highest.position) return {
            success: false,
            error: "noMemberPermissions"
        }
        return {success: true}
    }
}