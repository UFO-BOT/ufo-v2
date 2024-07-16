import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import EventConfig from "@/types/EventConfig";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import PunishmentMessagesSender from "@/services/moderation/PunishmentMessagesSender";
import ModAction from "@/types/moderation/ModAction";
import Settings from "@/types/database/Settings";
import properties from "@/properties/moderation.json";

export default class TestPunishmentEvent extends AbstractClientEvent implements EventConfig {
    public name = 'testPunishment'

    public async execute(type: 'kick' | 'ban', guildId: string, memberId: string): Promise<any> {
        let guild = this.client.guilds.cache.get(guildId)
        if (!guild) return
        let member = await guild.members.fetch({user: memberId, force: false})
        if (!member) return
        let settings = await this.db.manager.findOneBy(Settings, {guildid: guild.id}) as Settings;
        if (!settings) return
        const props = properties[settings?.language?.interface ?? 'en'];
        let options = {} as ModerationActionOptions
        options.action = type as ModAction
        options.guild = guild
        options.user = member.user
        options.member = member
        options.executor = guild.members.me
        options.duration = type === 'ban' ? 3600000 : null
        options.reason = props.testReason
        let sender = new PunishmentMessagesSender(settings, options)
        return sender.execute()
    }
}