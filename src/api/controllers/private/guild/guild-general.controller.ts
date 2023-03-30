import {Body, Controller, Get, Headers, Param, Post, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildGeneralDto} from "@/api/dto/guild/guild-general.dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildGeneralController extends Base {

    @Post(":id/general")
    async execute(@Req() request: GuildRequest, @Body() body: GuildGeneralDto) {
        request.guild.settings.prefix = body.prefix;
        request.guild.settings.language = body.language;
        await request.guild.settings.save();
        await this.manager.shards.get(request.guild.shardId).eval((client, context) => {
            const ufo = client as typeof this.client;
            let settings = ufo.cache.settings.get(context.guild)
            if(!settings) return;
            settings.prefix = context.body.prefix;
            settings.language = context.body.language;
            ufo.cache.settings.set(context.guild, settings);
        }, {guild: request.guild.id, body})
        return {message: "Guild settings saved successfully"}
    }

}