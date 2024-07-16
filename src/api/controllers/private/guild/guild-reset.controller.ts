import {BadRequestException, Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildResetDto} from "@/api/dto/guild/guild-reset.dto";
import Balance from "@/types/database/Balance";
import {Throttle} from "@nestjs/throttler";

@Controller('guilds')
@Throttle(15, 60)
@UseGuards(AuthGuard, GuildGuard)
export class GuildResetController extends Base {

    @Post('/:id/reset')
    async create(@Req() request: GuildRequest, @Body() body: GuildResetDto) {
        if(body.name !== request.guild.name) throw new BadRequestException("Guild name is incorrect")
        if(body.scopes.includes('balance')) await this.db.manager.delete(Balance, {guildid: request.guild.id})
        return {message: 'Specified guild scopes reset successfully'}
    }

}