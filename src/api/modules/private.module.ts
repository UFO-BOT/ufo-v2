import {Module} from "@nestjs/common";
import {BadgesController} from "@/api/controllers/private/badges.controller";
import {Oauth2Service} from "@/api/services/oauth2.service";
import {GuildsController} from "@/api/controllers/private/guilds.controller";
import {GuildInfoController} from "@/api/controllers/private/guild/guild-info.controller";
import {GuildGeneralController} from "@/api/controllers/private/guild/guild-general.controller";
import {GuildEconomyController} from "@/api/controllers/private/guild/guild-economy.controller";
import {GuildLogsController} from "@/api/controllers/private/guild/guild-logs.controller";
import {LeaderboardController} from "@/api/controllers/private/leaderboard/leaderboard.controller";
import {LeaderboardMemberController} from "@/api/controllers/private/leaderboard/leaderboard-member.controller";
import {GuildBalancesController} from "@/api/controllers/private/guild/guild-balances.controller";
import {GuildItemsController} from "@/api/controllers/private/guild/guild-items.controller";
import {GuildResetController} from "@/api/controllers/private/guild/guild-reset.controller";
import {GuildCommandsController} from "@/api/controllers/private/guild/guild-commands.controller";
import {GuildModerationController} from "@/api/controllers/private/guild/guild-moderation.controller";

@Module({
    controllers: [GuildsController, BadgesController, GuildInfoController, GuildGeneralController,
        GuildEconomyController, GuildModerationController, GuildLogsController, LeaderboardController,
        LeaderboardMemberController, GuildBalancesController, GuildItemsController, GuildResetController,
        GuildCommandsController],
    providers: [Oauth2Service]
})
export class PrivateModule {}