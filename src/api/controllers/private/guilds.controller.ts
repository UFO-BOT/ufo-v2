import {Controller, Get, Headers, Param, Req, UseGuards} from "@nestjs/common";
import {AuthorizedRequest} from "@/api/types/AuthorizedRequest";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {Oauth2Service} from "@/api/services/oauth2.service";
import { Request } from "@nestjs/common";
import {Guild, OAuth2Guild, PermissionsBitField} from "discord.js";

@Controller('guilds')
@UseGuards(AuthGuard)
export class GuildsController extends Base {

    constructor(private oauth2: Oauth2Service) {
        super();
    }

    @Get()
    async execute(@Headers("Authorization") token: string) {
        let guilds = await this.oauth2.getGuilds(token);
        let userGuilds = [];
        for(let guild of guilds) {
            console.log(guild)
            let botGuild = await this.manager.oneShardEval((client, context) =>
                client.guilds.cache.get(context.id), {context: {id: guild.id}}) as Guild
            userGuilds.push({
                id: guild.id,
                name: guild.name,
                icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.` +
                    `${guild.icon.startsWith("a_") ? "gif" : "png"}?size=128` : null,
                invited: Boolean(botGuild),
                manageable: new PermissionsBitField(BigInt(guild.permissions)).has("Administrator")
            })
        }
        return userGuilds
    }

}