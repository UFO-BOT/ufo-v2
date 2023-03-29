import {CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {RawGuildData} from "discord.js/typings/rawDataTypes";
import {ChannelType} from "discord.js";
import {GuildData} from "@/api/types/GuildData";
import {GuildRequest} from "@/api/types/GuildRequest";
import GuildSettings from "@/utils/GuildSettings";

@Injectable()
export class GuildGuard extends Base implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: GuildRequest = context.switchToHttp().getRequest()
        let guild = await this.manager.oneShardEval((client, context) =>
                client.guilds.cache.get(context.id),
            {context: {id: request.params.id}}) as RawGuildData
        if(!guild) throw new NotFoundException("Guild not found")
        let guildData = await this.manager.oneShardEval(async (client, context) => {
            let guild = client.guilds.cache.get(context.guild);
            let member = await guild?.members?.fetch(context.user).catch(() => undefined)
            if(!member || !member?.permissions?.has("Administrator")) return null;
            let roles = guild.roles.cache.map(role => Object.assign(role, {
                memberManageable: member.id === guild.ownerId ? true : role.position < member.roles.highest.position,
                botManageable: role.position < guild.members.me.roles.highest.position
            }))
            roles.sort((a, b) => b.position - a.position)
            roles.splice(roles.indexOf(roles.find(role => role.id === guild.id)), 1)
            let channels = guild.channels.cache
                .filter(chan => chan.type === context.ChannelType.GuildText || chan.type === context.ChannelType.GuildNews)
                .map(channel => Object.assign(channel, {
                    botManageable: channel.permissionsFor(guild.members.me)?.has("SendMessages")
            }))
            return {
                member, roles, channels,
                memberHighestRole: member.roles.highest,
                botHighestRole: guild.members.me.roles.highest,
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                shardId: guild.shardId
            }
        }, {context: {guild: guild.id, user: request.user.id, ChannelType}}) as GuildData
        if(!guildData) throw new ForbiddenException("Missing permissions to manage the guild")
        guildData.settings = await GuildSettings.findOrCreate(guild.id);
        request.guild = guildData;
        return true;
    }

}