import {BadRequestException, Body, Controller, Get, Headers, Param, Post, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildEconomyDto} from "@/api/dto/guild/guild-economy.dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildEconomyController extends Base {

    @Post(":id/economy")
    async execute(@Req() request: GuildRequest, @Body() body: GuildEconomyDto) {
        if(body.work.low > body.work.high)
            throw new BadRequestException("work.low value must be less than or equal to work.high value")
        if(body.moneybags.low > body.moneybags.high)
            throw new BadRequestException("moneybags.low value must be tess than or equal to moneybags.high value")
        if(body.messageXp?.min > body.messageXp?.max)
            throw new BadRequestException("messageXp.min value must be tess than or equal to messageXp.max value")
        if(!request.guild.settings.boost) {
            body.messageXp = null
            body.moneyBonuses = null
        }
        Object.assign(request.guild.settings, body);
        request.guild.settings.moneysymb = body.moneySymbol;
        await request.guild.settings.save();
        await this.manager.shards.get(request.guild.shardId).eval((client, context) => {
            client.emit('updateCache', context.guildId)
        }, {guildId: request.guild.id})
        return {message: "Guild settings saved successfully"}
    }

}