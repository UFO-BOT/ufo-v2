import {
    BadRequestException,
    Body, ClassSerializerInterceptor,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Param,
    Post,
    Req,
    UseGuards, UseInterceptors
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildModerationDto} from "@/api/dto/guild/guild-moderation.dto";
import GuildWarnsPunishment from "@/types/GuildWarnsPunishment";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildModerationController extends Base {

    @Post(":id/moderation")
    async execute(@Req() request: GuildRequest, @Body() body: GuildModerationDto) {
        let muteRole = request.guild.roles.find(r => r.id === body.muteRole)
        if (!muteRole) throw new BadRequestException("Invalid mute role")
        if (!muteRole.memberManageable) throw new ForbiddenException("Mute role is higher than member role")
        if (!muteRole.botManageable) throw new ForbiddenException("Mute role is higher than bot role")
        if (body.warnsPunishments.length > 10) new ForbiddenException("Maximum warns punishments count is 10")
        if (body.warnsPunishments.find(wp => body.warnsPunishments.filter(w => w.warns == wp.warns).length > 1))
            throw new BadRequestException("Warns punishments contain duplicates")
        body.warnsPunishments.map(wp => {
            if (wp.punishment.type === 'kick') wp.punishment.duration = null
            return wp
        })
        if (!request.guild.settings.boost) request.guild.settings.punishmentMessages = null
        else {
            request.guild.settings.punishmentMessages = {kick: {enabled: false}, ban: {enabled: false}}
            if (body.punishmentMessages?.kick?.enabled && (body.punishmentMessages?.kick?.message?.length > 0 ||
                body.punishmentMessages?.kick?.embed?.enabled)) {
                request.guild.settings.punishmentMessages.kick = body.punishmentMessages.kick
                if (!request.guild.settings.punishmentMessages.kick.embed.enabled)
                    request.guild.settings.punishmentMessages.kick.embed = {enabled: false}
            }
            if (body.punishmentMessages?.ban?.enabled && (body.punishmentMessages?.ban?.message?.length > 0 ||
                body.punishmentMessages?.ban?.embed?.enabled)) {
                request.guild.settings.punishmentMessages.ban = body.punishmentMessages.ban
                if (!request.guild.settings.punishmentMessages.ban.embed.enabled)
                    request.guild.settings.punishmentMessages.ban.embed = {enabled: false}
            }
        }
        request.guild.settings.muterole = muteRole.id
        request.guild.settings.useTimeout = body.useTimeout
        request.guild.settings.warnsPunishments = body.warnsPunishments as Array<GuildWarnsPunishment>
        await request.guild.settings.save()
        return {message: "Guild settings saved successfully"}
    }

}