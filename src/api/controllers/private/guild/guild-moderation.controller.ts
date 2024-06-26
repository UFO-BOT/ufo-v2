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
import {GuildModerationDto} from "@/api/dto/guild/guild-moderation.dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildModerationController extends Base {

    @Post(":id/moderation")
    async execute(@Req() request: GuildRequest, @Body() body: GuildModerationDto) {
        let muteRole = request.guild.roles.find(r => r.id === body.muteRole)
        if (!muteRole) throw new BadRequestException("Invalid mute role")
        if (!muteRole.memberManageable) throw new ForbiddenException("Mute role is higher than member role")
        if (!muteRole.botManageable) throw new ForbiddenException("Mute role is higher than bot role")
        request.guild.settings.muterole = muteRole.id
        request.guild.settings.useTimeout = body.useTimeout
        await request.guild.settings.save()
        return {message: "Guild settings saved successfully"}
    }

}