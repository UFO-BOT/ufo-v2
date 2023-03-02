import {Body, Controller, Delete, NotFoundException, Post, Req, UseGuards} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {GuildGuard} from "@/api/guards/guild.guard";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildBalanceDto} from "@/api/dto/guild/guild-balance.dto";
import Balance from "@/types/database/Balance";

@Controller('guilds/:id/balances/:user')
@UseGuards(AuthGuard, GuildGuard)
export class GuildBalancesController extends Base {

    @Post()
    async post(@Req() request: GuildRequest, @Body() body: GuildBalanceDto) {
        let user = await this.manager.shards.first().eval((client, context) =>
                client.users.fetch(context.id).catch(() => null),
            {id: request.params.user})
        if(!user) throw new NotFoundException('User not found')
        let balance = await this.db.manager.findOneBy(Balance, {
            guildid: request.guild.id,
            userid: request.params.user
        })
        if (!balance) {
            balance = new Balance()
            balance.guildid = request.guild.id;
            balance.userid = user.id;
            balance.balance = 0;
            balance.xp = 0;
            await this.db.manager.save(balance);
        }
        balance.balance = body.balance;
        if(body.resetXP) balance.xp = 0;
        await this.db.manager.save(balance);
        return {message: "Member balance saved successfully"}
    }

    @Delete()
    async delete(@Req() request: GuildRequest) {
        let user = await this.manager.shards.first().eval((client, context) =>
                client.users.fetch(context.id).catch(() => null),
            {id: request.params.user})
        if(!user) throw new NotFoundException('User not found')
        await this.db.manager.delete(Balance, {guildid: request.guild.id, userid: request.params.user})
        return {message: "Member balance deleted successfully"}
    }

}