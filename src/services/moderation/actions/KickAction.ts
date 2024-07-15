import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import ModAction from "@/types/moderation/ModAction";
import ModActionExecutionResult from "@/types/moderation/ModActionExecutionResult";
import MemberModeratable from "@/utils/MemberModeratable";
import properties from "@/properties/moderation.json";
import PunishmentMessagesSender from "@/services/moderation/PunishmentMessagesSender";

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

        let sender = new PunishmentMessagesSender(this.settings, this.options)
        await sender.execute()

        await this.options.member.kick(this.options.reason);
        return {success: true}
    }
}