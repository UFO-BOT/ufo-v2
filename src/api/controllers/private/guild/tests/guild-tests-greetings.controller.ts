import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildTestsGreetingsDto} from "@/api/dto/guild/tests/guild-tests-greetings-dto";

@Controller('guilds')
@UseGuards(AuthGuard, GuildGuard)
export class GuildTestsGreetingsController extends Base {

    @Post(":id/tests/greetings")
    async execute(@Req() request: GuildRequest, @Body() body: GuildTestsGreetingsDto) {
        await this.manager.shards.get(request.guild.shardId).eval(async (client, context) => {
            let member = await client.guilds.cache.get(context.guildId)?.members
                ?.fetch({user: context.memberId, force: false})
            if (!member) return
            if (context.type === 'join') client.emit("guildMemberAdd", member)
            else if(context.type === 'leave') client.emit("guildMemberRemove", member)
        }, {memberId: request.user, guildId: request.guild.id, type: body.type})
        return {message: "Test completed"}
    }

}