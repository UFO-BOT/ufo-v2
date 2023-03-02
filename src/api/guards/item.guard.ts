import {BadRequestException, CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {ChannelType} from "discord.js";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildItemDto} from "@/api/dto/guild/guild-item.dto";

@Injectable()
export class ItemGuard extends Base implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: GuildRequest = context.switchToHttp().getRequest()
        const body: GuildItemDto = request.body as any;
        if(body.addRole && !request.guild.roles.find(r => r.id === body.addRole))
            throw new BadRequestException("addRole role not found")
        if(body.removeRole && !request.guild.roles.find(r => r.id === body.removeRole))
            throw new BadRequestException("removeRole role not found")
        return true;
    }

}