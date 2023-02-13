import {Module} from "@nestjs/common";
import {CommandsController} from "@/api/controllers/public/commands.controller";
import {StatsController} from "@/api/controllers/public/stats.controller";

@Module({
    controllers: [CommandsController, StatsController]
})
export class PublicModule {}