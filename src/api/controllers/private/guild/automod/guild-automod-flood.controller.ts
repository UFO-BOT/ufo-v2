import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Param,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import GuildAutoMod from "@/types/automod/GuildAutoMod";
import {GuildAutomodFloodDto} from "@/api/dto/guild/automod/guild-automod-flood.dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildAutomodFloodController extends Base {

    @Post(":id/automod/flood")
    async execute(@Req() request: GuildRequest, @Body() body: GuildAutomodFloodDto) {
        if (!request.guild.settings.autoModeration) request.guild.settings.autoModeration = {} as GuildAutoMod
        if (!body.enabled) {
            request.guild.settings.autoModeration.flood = {enabled: false}
            await request.guild.settings.save()
            return {message: "Guild settings saved successfully"}
        }
        body.whitelist.channels = body.whitelist.channels.filter(c => request.guild.channels.find(ch => ch.id === c))
        body.whitelist.roles = body.whitelist.roles.filter(r => request.guild.roles.find(role => role.id === r))
        if (['warn', 'kick'].includes(body.punishment.type)) body.punishment.duration = 0
        request.guild.settings.autoModeration.flood = body
        await request.guild.settings.save()
        await this.manager.shards.get(request.guild.shardId).eval((client, context) => {
            client.emit('updateCache', context.guildId)
        }, {guildId: request.guild.id})
        return {message: "Guild settings saved successfully"}
    }

}