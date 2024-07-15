import {
    Body,
    Controller, HttpException, HttpStatus,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildTestsPunishmentsDto} from "@/api/dto/guild/tests/guild-tests-punishments.dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildTestsPunishmentsController extends Base {

    @Post(":id/tests/punishments")
    async execute(@Req() request: GuildRequest, @Body() body: GuildTestsPunishmentsDto) {
        if (!request.guild.settings.boost)
            throw new HttpException('UFO Boost is not activated on the server', HttpStatus.PAYMENT_REQUIRED)
        await this.manager.shards.get(request.guild.shardId).eval(async (client, context) => {
            client.emit("testPunishment", context.type, context.guildId, context.memberId)
        }, {memberId: request.user, guildId: request.guild.id, type: body.type})
        return {message: "Test completed"}
    }

}