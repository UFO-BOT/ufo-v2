import {BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {ChannelType} from "discord.js";
import {GuildRequest} from "@/api/types/GuildRequest";
import {GuildItemDto} from "@/api/dto/guild/guild-item.dto";

@Injectable()
export class ItemGuard extends Base implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: GuildRequest = context.switchToHttp().getRequest()
        const body: GuildItemDto = request.body as any;
        if(body.addRole) {
            let role = request.guild.roles.find(r => r.id === body.addRole);
            if(!role) throw new BadRequestException("addRole role not found")
            if(!role.memberManageable) throw new ForbiddenException("addRole is higher than member role")
            if(!role.botManageable) throw new ForbiddenException("addRole is higher than bot role")
        }
        if(body.removeRole) {
            let role = request.guild.roles.find(r => r.id === body.removeRole);
            if(!role) throw new BadRequestException("removeRole role not found")
            if(!role.memberManageable) throw new ForbiddenException("removeRole is higher than member role")
            if(!role.botManageable) throw new ForbiddenException("removeRole is higher than bot role")
        }
        return true;
    }

}