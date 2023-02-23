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
            throw new BadRequestException("work.low value must be lower than work.high value")
        if(body.moneybags.low > body.moneybags.high)
            throw new BadRequestException("moneybags.low value must be lower than moneybags.high value")
        Object.assign(request.guild.settings, body);
        request.guild.settings.moneysymb = body.moneySymbol;
        await request.guild.settings.save();
        await this.manager.shards.get(request.guild.shardId).eval((client, context) => {
            const ufo = client as typeof this.client;
            let settings = ufo.cache.settings.get(context.guild)
            if(!settings) return;
            settings.moneysymb = context.body.moneySymbol;
            ufo.cache.settings.set(context.guild, settings);
        }, {guild: request.guild.id, body})
        return {message: "Guild settings saved successfully"}
    }

}