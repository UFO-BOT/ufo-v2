import {Controller, Get, Headers, Param, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {Oauth2Service} from "@/api/services/oauth2.service";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildInfoController extends Base {

    @Get(":id/info")
    async execute(@Req() request: GuildRequest) {
        return {
            id: request.guild.id,
            name: request.guild.name,
            icon: request.guild.icon ? `https://cdn.discordapp.com/icons/${request.guild.id}/${request.guild.icon}.` +
                    `${request.guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=128` : null,
            channels: request.guild.channels
                .map(chan => {return {id: chan.id, name: chan.name, botManageable: chan.botManageable}}),
            roles: request.guild.roles
                .map(role => {return {id: role.id, name: role.name, color: role.color,
                    memberManageable: role.memberManageable, botManageable: role.botManageable}}),
            boost: request.guild.settings?.boost ?? false
        }
    }

}