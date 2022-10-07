import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModAction from "@/types/ModAction";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";
import Mute from "@/types/database/Mute";
import MuteEnding from "@/services/endings/MuteEnding";
import {BaseGuildTextChannel, BaseGuildVoiceChannel, ChannelType, GuildChannel, Role, ThreadChannel} from "discord.js";

export default class UnmuteAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Unmute}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        if (((this.options.guild.ownerId !== this.options.member.id) &&
                this.options.member.roles.highest.position >= this.options.executor.roles.highest.position) ||
            this.options.guild.ownerId === this.options.member.id) return {
            success: false,
            error: "noMemberPermissions"
        }
        let mute = await this.db.manager.findOneBy(Mute, {
            guildid: this.options.guild.id,
            userid: this.options.member.id
        })
        if(!mute) return {
            success: false,
            error: "notMuted"
        }
        let role = this.options.guild.roles.cache.get(mute.muterole)
        if(role.position >= this.options.guild.members.me.roles.highest.position) return {
            success: false,
            error: "noBotPermissions"
        }
        await this.options.member.roles.remove(role);
        await this.options.member.timeout(null).catch(() => null);
        await mute.remove();
        return {success: true}
    }
}