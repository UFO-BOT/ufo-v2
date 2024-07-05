import AbstractService from "@/abstractions/AbstractService";
import {Message, TextChannel} from "discord.js";
import GuildSettings from "@/utils/GuildSettings";
import GuildAutoMod from "@/types/automod/GuildAutoMod";
import ModerationActionOptions from "@/types/ModerationActionOptions";
import ModerationAction from "@/services/moderation/ModerationAction";
import ModAction from "@/types/ModAction";
import WarnAction from "@/services/moderation/actions/WarnAction";
import MuteAction from "@/services/moderation/actions/MuteAction";
import KickAction from "@/services/moderation/actions/KickAction";
import BanAction from "@/services/moderation/actions/BanAction";
import WarnsPunishmentsExecution from "@/services/moderation/WarnsPunishmentsExecution";
import GreetingMessageTemplate from "@/services/templates/messages/GreetingMessageTemplate";
import AutomodMessageTemplate from "@/services/templates/messages/AutomodMessageTemplate";

export default abstract class AutoModeration extends AbstractService {
    protected deleteMessages: boolean
    protected options: object

    protected constructor(public message: Message, public type: keyof GuildAutoMod) {
        super();
    }

    public async execute(): Promise<any> {
        let settings = await GuildSettings.getCache(this.message.guildId);
        let autoModeration = settings.autoModeration[this.type]
        if(!autoModeration?.enabled) return
        if (this.message.member.permissions.has("Administrator")) return
        if (this.message.member.roles.cache
            .map(role => autoModeration.whitelist?.roles?.includes(role.id)).includes(true)) return
        if (autoModeration.whitelist?.channels?.includes(this.message.channel.id as string)) return
        this.options = autoModeration.options
        this.deleteMessages = autoModeration.deleteMessages
        let result = await this.detect()
        if (!result) return
        if (autoModeration.message?.enabled) {
            let channel = (this.message.guild.channels.cache.get(autoModeration.message.channel)
                ?? this.message.channel) as TextChannel
            let template = new AutomodMessageTemplate(this.message.member, this.message.guild,
                this.message.channel as TextChannel)
            let message = template.compile(autoModeration.message.template)
            if (message) await channel.send({content: message}).catch(() => {})
        }
        if (!autoModeration.punishment?.enabled) return
        let options = {} as ModerationActionOptions
        options.guild = this.message.guild
        options.user = this.message.author
        options.member = this.message.member
        options.executor = this.message.guild.members.me
        if(autoModeration.punishment?.duration) options.duration = autoModeration.punishment.duration
        if(autoModeration.punishment?.reason?.length) options.reason = autoModeration.punishment.reason
        options.autoMod = true
        let action: ModerationAction
        switch (autoModeration.punishment?.type) {
            case ModAction.Warn:
                action = new WarnAction(options)
                break
            case ModAction.Mute:
                action = new MuteAction(options)
                break
            case ModAction.Kick:
                action = new KickAction(options)
                break
            case ModAction.Ban:
                action = new BanAction(options)
        }
        let embed = await action.execute()
        if (embed) await this.message.channel.send({embeds: [embed]})
        if (autoModeration.punishment?.type !== 'warn') return
        let wpExecution = new WarnsPunishmentsExecution({
            guild: this.message.guild,
            channel: this.message.channel as TextChannel,
            member: this.message.member
        })
        return wpExecution.execute()
    }

    protected abstract detect(): Promise<boolean>
}
