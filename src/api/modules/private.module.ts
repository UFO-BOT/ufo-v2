import {Module, Scope, UseGuards} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "@/api/guards/auth.guard";
import {BadgesController} from "@/api/controllers/private/badges.controller";
import {Oauth2Service} from "@/api/services/oauth2.service";
import {GuildsController} from "@/api/controllers/private/guilds.controller";

@Module({
    controllers: [GuildsController, BadgesController],
    providers: [Oauth2Service]
})
export class PrivateModule {}