import AutoModeration from "@/services/automod/AutoModeration";
import {Message} from "discord.js";
import {AutoModInvitesOptions} from "@/types/automod/AutoModInvites";

export default class AutoModerationInvites extends AutoModeration {
    protected declare options: AutoModInvitesOptions

    constructor(public message: Message) {
        super(message, 'invites');
    }

    protected async detect(): Promise<boolean> {
        for (let arg of this.message.content.split(' ')) {
            if (!arg.includes('discord.gg') && !arg.includes('discord.com/invite') &&
                !arg.includes('discordapp.com/invite')) continue
            let code = arg.split('/')[arg.split('/').length - 1]
                ?? arg.split('/')[arg.split('/').length - 2]
            if (this.options.whitelistGuilds?.includes(code)) continue
            let inv = await this.client.fetchInvite(code).catch(() => null)
            if(!inv) continue
            if (inv.guild.id === this.message.guildId
                || this.options.whitelistGuilds?.includes(inv.guild.id as string)) continue
            if (this.deleteMessages) await this.message.delete()
            return true
        }
        return false
    }
}