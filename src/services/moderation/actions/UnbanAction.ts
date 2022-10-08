import {ChannelType} from "discord.js";
import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModAction from "@/types/ModAction";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";
import Ban from "@/types/database/Ban";

export default class UnbanAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Unban}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        if(!this.options.guild.members.me.permissions.has("BanMembers")) return {
            success: false,
            error: "noBotPermissions"
        }
        let ban = await this.db.manager.findOneBy(Ban, {
            guildid: this.options.guild.id,
            userid: this.options.user.id
        })
        await this.options.guild.bans.remove(this.options.user);
        if(ban) await ban.remove();
        return {success: true}
    }
}