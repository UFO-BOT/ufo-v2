import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException, NotFoundException,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import {compile} from "handlebars";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildGreetingsDto} from "@/api/dto/guild/guild-greetings.dto";
import GuildGreetings from "@/types/greetings/GuildGreetings";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildGreetingsController extends Base {

    @Post(":id/greetings")
    async execute(@Req() request: GuildRequest, @Body() body: GuildGreetingsDto) {
        if (!request.guild.settings.greetings) request.guild.settings.greetings = {} as GuildGreetings
        try {
            if (body.join?.message) compile(body.join.message, {noEscape: true})({})
            if (body.leave?.message) compile(body.leave.message, {noEscape: true})({})
            if (body.dm?.message) compile(body.dm.message, {noEscape: true})({})
        }
        catch (e) {
            throw new BadRequestException("Template compilation error")
        }
        if (!body.join.enabled || (!body.join.message?.length && !body.join.embed?.enabled))
            request.guild.settings.greetings.join = {enabled: false}
        else {
            if (!request.guild.channels.find(ch => ch.botManageable && ch.id === body.join.channel))
                throw new NotFoundException("Channel for join message not found")
            request.guild.settings.greetings.join = body.join
            if (!body.join.embed.enabled) request.guild.settings.greetings.join.embed = {enabled: false}
        }
        if (!body.leave.enabled || (!body.leave.message?.length && !body.leave.embed?.enabled))
            request.guild.settings.greetings.leave = {enabled: false}
        else {
            if (!request.guild.channels.find(ch => ch.botManageable && ch.id === body.leave.channel))
                throw new NotFoundException("Channel for leave message not found")
            request.guild.settings.greetings.leave = body.leave
            if (!body.leave.embed.enabled) request.guild.settings.greetings.leave.embed = {enabled: false}
        }
        if (!body.dm.enabled || (!body.dm.message?.length && !body.dm.embed?.enabled))
            request.guild.settings.greetings.dm = {enabled: false}
        else {
            request.guild.settings.greetings.dm = body.dm
            if (!body.dm.embed.enabled) request.guild.settings.greetings.dm.embed = {enabled: false}
        }
        console.log(body.join.embed)
        request.guild.settings.greetings.joinRoles = body.joinRoles
            .filter(r => request.guild.roles.find(role => role.memberManageable && role.botManageable && role.id === r))
        await request.guild.settings.save()
        return {message: "Guild settings saved successfully"}
    }

}