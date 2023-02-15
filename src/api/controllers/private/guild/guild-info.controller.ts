import {Controller, Get, Headers, Param, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {settings} from "cluster";

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
            settings: {
                prefix: request.guild.settings.prefix ?? "!",
                language: {
                    commands: request.guild.settings.language?.commands ?? "en",
                    interface: request.guild.settings.language?.interface ?? "en"
                },
                moneySymbol: request.guild.settings.moneysymb ?? this.constants.defaultMoneySymbol,
                muteRole: request.guild.settings.muterole ?? null,
                work: request.guild.settings.work ?? {low: 1, high: 500, cooldown: 1200000},
                moneybags: request.guild.settings.moneybags ?? {low: -500, high: 500, cooldown: 600000},
                minBet: request.guild.settings.minBet ?? 100,
                boost: request.guild.settings.boost ?? false
            }
        }
    }

}