import {Module, Scope, UseGuards} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "@/api/guards/auth.guard";
import {BadgesController} from "@/api/controllers/private/badges.controller";
import {Oauth2Service} from "@/api/services/oauth2.service";
import {GuildsController} from "@/api/controllers/private/guilds.controller";
import {GuildInfoController} from "@/api/controllers/private/guild/guild-info.controller";
import {GuildGeneralController} from "@/api/controllers/private/guild/guild-general.controller";

@Module({
    controllers: [GuildsController, BadgesController, GuildInfoController, GuildGeneralController],
    providers: [Oauth2Service]
})
export class PrivateModule {}