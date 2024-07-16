import {ChannelType} from "discord.js";
import {BadRequestException, Body, Controller, Get, Headers, Param, Post, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildLogsDto} from "@/api/dto/guild/guild-logs.dto";
import {GuildLog, GuildLogType} from "@/types/GuildLog";
import {Throttle} from "@nestjs/throttler";

@Controller('guilds')
@Throttle(15, 60)
@UseGuards(AuthGuard, GuildGuard)
export class GuildLogsController extends Base {

    @Post(":id/logs")
    async execute(@Req() request: GuildRequest, @Body() body: GuildLogsDto) {
        let list = {} as GuildLog
        for (let log of this.logs) {
            if (typeof body.list[log]?.enabled !== 'boolean') continue
            if (!body.list[log].enabled) {
                request.guild.settings.logs.list[log] = {enabled: false, channel: null}
                continue
            }
            let channel = request.guild.channels.filter(c => c.botManageable)
                .find(chan => chan.id == body.list[log]?.channel)
            if (!channel) continue
            list[log] = body.list[log]
        }
        let channels = body.ignore.channels.filter(chan => !!request.guild.channels.find(ch =>
            ch.id === chan &&
            (ch.type == ChannelType.GuildText || ch.type == ChannelType.GuildNews)
        ))
        request.guild.settings.logs = {
            list,
            ignore: {channels}
        }
        await request.guild.settings.save()
        return {message: "Guild settings saved successfully"}
    }

    private logs: Array<GuildLogType> = [
        "messageDelete",
        "messageEdit",
        "messageDeleteBulk",
        "roleCreate",
        "roleEdit",
        "roleDelete",
        "moderationWarn",
        "moderationMute",
        "moderationKick",
        "moderationBan",
        "moderationUnmute",
        "moderationUnban",
    ]

}