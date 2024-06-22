import {CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {RawGuildData} from "discord.js/typings/rawDataTypes";
import {ChannelType} from "discord.js";
import {GuildInfo} from "@/api/types/GuildInfo";
import {LeaderboardRequest} from "@/api/types/LeaderboardRequest";

@Injectable()
export class LeaderboardGuard extends Base implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: LeaderboardRequest = context.switchToHttp().getRequest()
        let guild = await this.manager.oneShardEval((client, context) =>
                client.guilds.cache.get(context.id),
            {context: {id: request.params.id}}) as RawGuildData
        if(!guild) throw new NotFoundException("Guild not found")
        let guildData = await this.manager.oneShardEval(async (client, context) => {
            let guild = client.guilds.cache.get(context.guild);
            let member = await guild?.members?.fetch(context.user).catch(() => undefined)
            if(!member) return null;
            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                shardId: guild.shardId
            }
        }, {context: {guild: guild.id, user: request.user, ChannelType}}) as GuildInfo
        if(!guildData) throw new ForbiddenException("Missing permissions view leaderboard of this guild")
        request.guild = guildData;
        return true;
    }

}