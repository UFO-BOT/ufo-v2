import {BadRequestException, Body, Controller, Get, Headers, Param, Post, Query, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {LeaderboardRequest} from "@/api/types/LeaderboardRequest";
import Balance from "@/types/database/Balance";
import {LeaderboardGuard} from "@/api/guards/leaderboard.guard";
import {LeaderboardDto} from "@/api/dto/leaderboard.dto";
import {User} from "discord.js";

interface Leader {
    number: number
    user: {
        id: string
        tag: string
        avatar: string
    }
    balance: number
    xp: number
}

@Controller('leaderboard')
@UseGuards(AuthGuard, LeaderboardGuard)
export class LeaderboardController extends Base {

    @Get(":id")
    async execute(@Req() request: LeaderboardRequest, @Query() query: LeaderboardDto) {
        let count = await this.db.manager.countBy(Balance, {guildid: request.guild.id});
        let pageCount = Math.ceil(count/10);
        if(query.page > pageCount) query.page = pageCount;
        query.page--;
        let leaders: Array<Balance> = await this.db.mongoManager.createCursor(Balance, {guildid: request.guild.id})
            .sort({[query.sort]: -1})
            .skip(query.page*10)
            .limit(10)
            .toArray();
        let body = {
            guildName: request.guild.name,
            pageCount,
            leaders: [] as Array<Leader>
        }
        for(let num in leaders) {
            let number = parseInt(num, 10);
            let leader = leaders[number]
            let user = await this.manager.shards.first().eval((client, context) =>
                    client.users.fetch(context.id).then().catch(() => null),
                {id: leader.userid})
            if(!user) continue;
            body.leaders.push({
                number: (number + 1)+query.page*10,
                user: {
                    id: user.id,
                    tag: user.tag,
                    avatar: user.avatarURL ?? user.defaultAvatarURL
                },
                balance: leader.balance,
                xp: leader.xp
            })
        }
        return body
    }

}