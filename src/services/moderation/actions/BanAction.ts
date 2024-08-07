import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import ModAction from "@/types/moderation/ModAction";
import ModActionExecutionResult from "@/types/moderation/ModActionExecutionResult";
import Ban from "@/types/database/Ban";
import MemberModeratable from "@/utils/MemberModeratable";
import BanEnding from "@/services/endings/BanEnding";
import properties from "@/properties/moderation.json"
import PunishmentMessagesSender from "@/services/moderation/PunishmentMessagesSender";

export default class BanAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Ban}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        const props = properties[this.settings.language?.interface ?? 'en'];

        if (!MemberModeratable(this.options.executor, this.options.member)) return {
            success: false,
            error: "noMemberPermissions"
        }
        if(this.options.member && !this.options.member?.bannable) return {
            success: false,
            error: "noBotPermissions"
        }
        let ban = await this.db.manager.findOneBy(Ban, {
            guildid: this.options.guild.id,
            userid: this.options.user.id
        })
        if(ban) return {
            success: false,
            error: "alreadyBanned"
        }
        if(this.options.duration) {
            ban = new Ban()
            ban.guildid = this.options.guild.id;
            ban.userid = this.options.user.id;
            ban.casenum = this.options.number;
            ban.ends = new Date(Date.now() + this.options.duration);
            if(this.options.duration < 60000) ban.timeout = true;
            await ban.save();
            if(this.options.duration < 60000) setTimeout(async () => {
                ban = await this.db.manager.findOneBy(Ban, {guildid: ban.guildid, userid: ban.userid});
                if(!ban) return;
                let ending = new BanEnding(ban)
                await ending.end()
            }, this.options.duration)
        }
        this.options.member = await this.options.guild.members.fetch(this.options.user).catch(() => null)
        if(this.options.member) {
            let sender = new PunishmentMessagesSender(this.settings, this.options)
            await sender.execute()
        }
        await this.options.guild.members.ban(this.options.user, {
            deleteMessageDays: this.options.daysDelete ?? 0,
            reason: this.options.reason
        })
        return {success: true}
    }
}