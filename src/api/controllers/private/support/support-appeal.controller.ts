import {Body, Controller, ForbiddenException, Get, Post, Req, UseGuards} from "@nestjs/common";
import {User, WebhookClient} from "discord.js";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {SupportAppealDto} from "@/api/dto/support/support-appeal.dto";
import Appeal from "@/types/database/Appeal";
import SupportEmbed from "@/utils/SupportEmbed";
import {Throttle} from "@nestjs/throttler";
import support from "@/properties/support.json"

@Controller('support/appeal')
@Throttle(15, 60)
@UseGuards(AuthGuard)
export class SupportAppealController extends Base {

    @Get()
    async questions(@Req() request: GuildRequest) {
        await this.check(request.user)
        return {questions: support.appeal}
    }

    @Post()
    async submit(@Req() request: GuildRequest, @Body() body: SupportAppealDto) {
        await this.check(request.user)
        let appeal = new Appeal()
        appeal.userid = request.user
        appeal.answers = body.answers
        appeal.declined = false
        await appeal.save()
        let user = await this.manager.shards.first().eval((client, context) =>
            client.users.fetch(context.userId),
            {userId: request.user})
        let hook = new WebhookClient({id: '799795939417391105', token: process.env.WEBHOOK_REQUESTS})
        let embed = SupportEmbed.appeal(user, body.answers)
        await hook.send({embeds: [embed]})
        return {message: 'Appeal submitted successfully'}
    }

    private async check(userId: string) {
        let ban = await this.manager.oneShardEval((client, context) =>
            client.guilds.cache.get(context.supportGuildId)?.bans?.fetch(context.userId).catch(() => null),
            {context: {supportGuildId: this.constants.supportGuildId, userId}})
        if (!ban) throw new ForbiddenException("User is not banned")
        let appeal = await this.db.manager.findOneBy(Appeal, {userid: userId}) as Appeal
        if (appeal) {
            if (appeal.declined) throw new ForbiddenException("Appeal has already been declined")
            else throw new ForbiddenException("Appeal has already been submitted")
        }
    }

}