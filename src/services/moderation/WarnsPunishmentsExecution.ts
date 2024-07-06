import AbstractService from "@/abstractions/AbstractService";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import Settings from "@/types/database/Settings";
import {EmbedBuilder, Guild} from "discord.js";
import Case from "@/types/database/Case";
import ModAction from "@/types/moderation/ModAction";
import properties from "@/properties/moderation.json";
import ModerationAction from "@/services/moderation/ModerationAction";
import MuteAction from "@/services/moderation/actions/MuteAction";
import KickAction from "@/services/moderation/actions/KickAction";
import BanAction from "@/services/moderation/actions/BanAction";
import WarnsPunishmentsExecutionOptions from "@/types/moderation/WarnsPunishmentsExecutionOptions";

export default class WarnsPunishmentsExecution extends AbstractService {
    public settings: Settings

    constructor(public options: WarnsPunishmentsExecutionOptions) {
        super();
    }

    public async execute(): Promise<EmbedBuilder> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: this.options.guild.id}) as Settings
        if (!settings.warnsPunishments?.length) return
        let warnsCount = await this.db.manager.countBy(Case, {
            guildid: this.options.guild.id,
            userid: this.options.member.id,
            action: ModAction.Warn
        })
        let wp = settings.warnsPunishments.find(w => w.warns === warnsCount)
        if (!wp) return
        let options = {} as ModerationActionOptions
        options.guild = this.options.guild
        options.user = this.options.member.user
        options.member = this.options.member
        options.executor = this.options.guild.members.me
        options.duration = wp.punishment.duration ?? null
        options.reason = `${warnsCount} ${properties[settings.language?.interface ?? "en"].warns}`
        options.autoMod = true
        let wpAction: ModerationAction
        switch (wp.punishment.type) {
            case ModAction.Mute:
                wpAction = new MuteAction(options)
                break
            case ModAction.Kick:
                wpAction = new KickAction(options)
                break
            case ModAction.Ban:
                wpAction = new BanAction(options)
        }
        let embed = await wpAction.execute()
        if (embed) await this.options.channel.send({embeds: [embed]})
    }
}
