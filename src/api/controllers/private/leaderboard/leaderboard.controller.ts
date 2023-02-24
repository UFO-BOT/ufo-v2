import {BadRequestException, Body, Controller, Get, Headers, Param, Post, Query, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {LeaderboardRequest} from "@/api/types/LeaderboardRequest";
import Balance from "@/types/database/Balance";
import {LeaderboardGuard} from "@/api/guards/leaderboard.guard";
import {LeaderboardDto} from "@/api/dto/leaderboard.dto";
import {LeaderboardMember} from "@/api/types/LeaderboardMember";
import Leaderboard from "@/utils/Leaderboard";

@Controller('leaderboard')
@UseGuards(AuthGuard, LeaderboardGuard)
export class LeaderboardController extends Base {

    @Get(":id")
    async execute(@Req() request: LeaderboardRequest, @Query() query: LeaderboardDto) {
        let leaderboard = await Leaderboard.getGuildLeaderboard(request.guild.id, query.sort, query.page)
        let body = {
            guildName: request.guild.name,
            pageCount: leaderboard.pageCount,
            leaders: [] as Array<LeaderboardMember>
        }
        for(let num in leaderboard.leaders) {
            let number = parseInt(num, 10);
            let leader = leaderboard.leaders[number]
            let user = await this.manager.shards.first().eval((client, context) =>
                    client.users.fetch(context.id).then().catch(() => null),
                {id: leader.userid})
            if(!user) continue;
            body.leaders.push({
                number: (query.page-1)*10+number+1,
                user: {
                    id: user.id,
                    tag: user.tag,
                    avatar: user.avatarURL ?? user.defaultAvatarURL
                },
                balance: leader.balance === Infinity ? 'Infinity' : leader.balance,
                xp: leader.xp
            })
        }
        return body
    }

}