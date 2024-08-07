import {Role} from "discord.js";
import {Controller, Get, Param, Req, UseGuards} from "@nestjs/common";
import {AuthorizedRequest} from "@/api/types/AuthorizedRequest";
import Base from "@/abstractions/Base";
import badges from "@/properties/badges.json";
import {AuthGuard} from "@/api/guards/auth.guard";
import {Throttle} from "@nestjs/throttler";

@Controller('badges')
@Throttle(15, 60)
@UseGuards(AuthGuard)
export class BadgesController extends Base {

    @Get()
    async execute(@Req() request: AuthorizedRequest) {
        let roles: Array<Role> = await this.manager.oneShardEval((client, context) =>
            client.guilds.cache.get(context.supportGuildId)?.members?.fetch(context.id)
                ?.then(m => m.roles.cache)
                ?.catch(() => undefined),
            {context: {supportGuildId: this.constants.supportGuildId, id: request.user}})
        let badgesList = [];
        for(let role in badges)
            if(roles?.find(r => r.id === role)) badgesList.push(badges[role as keyof typeof badges])
        return badgesList;
    }

}