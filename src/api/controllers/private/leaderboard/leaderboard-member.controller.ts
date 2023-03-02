import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Headers,
    NotFoundException,
    Param,
    Post,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {LeaderboardRequest} from "@/api/types/LeaderboardRequest";
import Balance from "@/types/database/Balance";
import {LeaderboardGuard} from "@/api/guards/leaderboard.guard";
import Leaderboard from "@/utils/Leaderboard";

@Controller('leaderboard')
@UseGuards(AuthGuard, LeaderboardGuard)
export class LeaderboardMemberController extends Base {

    @Get(":id/:user")
    async execute(@Req() request: LeaderboardRequest) {
        let user = await this.manager.shards.first().eval((client, context) =>
                client.users.fetch(context.id).catch(() => null),
            {id: request.params.user})
        if(!user) throw new NotFoundException("User not found")
        let balance = await this.db.manager.findOneBy(Balance, {guildid: request.guild.id, userid: user.id})
        if(!balance) balance = {balance: 0, xp: 0} as Balance;
        let number = await Leaderboard.leaderboardRank(request.guild.id, user.id);
        return {
            guildName: request.guild.name,
            leader: {
                number,
                user: {
                    id: user.id,
                    tag: user.tag,
                    avatar: user.avatarURL ?? user.defaultAvatarURL
                },
                balance: balance.balance === Infinity ? 'Infinity' : balance.balance,
                xp: balance.xp
            }
        }
    }

}