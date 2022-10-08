import ModerationAction from "@/services/moderation/ModerationAction";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModAction from "@/types/ModAction";
import ModActionExecutionResult from "@/types/ModActionExecutionResult";
import Mute from "@/types/database/Mute";
import MuteEnding from "@/services/endings/MuteEnding";
import {BaseGuildTextChannel, BaseGuildVoiceChannel, ChannelType, GuildChannel, Role, ThreadChannel} from "discord.js";
import MemberModeratable from "@/utils/MemberModeratable";

export default class MuteAction extends ModerationAction {
    constructor(options: Omit<ModerationActionOptions, 'action'>) {
        super(Object.assign(options, {action: ModAction.Mute}));
    }

    public async action(): Promise<ModActionExecutionResult> {
        if (!MemberModeratable(this.options.executor, this.options.member)) return {
            success: false,
            error: "noMemberPermissions"
        }
        let mute = await this.db.manager.findOneBy(Mute, {
            guildid: this.options.guild.id,
            userid: this.options.member.id
        })
        if(mute) return {
            success: false,
            error: "alreadyMuted"
        }
        let role = this.options.guild.roles.cache.get(this.settings?.muterole)
        if(!role) {
            role = await this.createMuteRole();
            if(!role) return {
                success: false,
                error: "noMuteRolePermissions"
            }
            this.settings.muterole = role.id;
            await this.settings.save();
        }
        if(role.position >= this.options.guild.members.me.roles.highest.position) return {
            success: false,
            error: "noBotPermissions"
        }
        mute = new Mute()
        mute.guildid = this.options.guild.id;
        mute.userid = this.options.member.id;
        mute.muterole = role.id;
        mute.casenum = this.options.number;
        mute.infinity = !this.options.duration;
        if(!mute.infinity) mute.ends = new Date(Date.now() + this.options.duration);
        if(this.options.duration < 60000) mute.timeout = true;
        await this.db.manager.save(mute);
        await this.options.member.roles.add(role);
        await this.options.member.timeout(this.options.duration).catch(() => null);
        if(this.options.duration < 60000) setTimeout(async () => {
            mute = await this.db.manager.findOneBy(Mute, {guildid: mute.guildid, userid: mute.userid});
            if(!mute) return;
            let ending = new MuteEnding(mute)
            await ending.end()
        }, this.options.duration)
        return {success: true}
    }

    private async createMuteRole(): Promise<Role> {
        let perms = this.options.guild.members.me.permissions;
        if(!perms.has("ManageRoles") || !perms.has("ManageChannels")) return null;
        let role = await this.options.guild.roles.create({
            name: "Muted",
            color: "#6d6d6d",
            permissions: []
        })
        for(let chan of this.options.guild.channels.cache) {
            let channel = chan[1];
            if(channel instanceof ThreadChannel) continue;
            await channel.permissionOverwrites.create(role, {
                SendMessages: false,
                AddReactions: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false,
                SendMessagesInThreads: false,
                Connect: false
            }).catch(() => null)
        }
        return role;
    }
}