import {User} from "discord.js";
import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import Base from "@/abstractions/Base";
import fetch from "node-fetch";
import {Oauth2Service} from "@/api/services/oauth2.service";

@Injectable()
export class AuthGuard extends Base implements CanActivate {

    constructor(private oauth2: Oauth2Service) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        let token = request.header("Authorization")
        let user = await this.oauth2.getUser(token)
        /*let user = await this.manager.shards.first().eval((client, context) =>
            client.users.fetch(context.user).catch(() => {}), {user: id})*/
        request.token = token;
        request.user = user;
        if(user) return true;
        else throw new UnauthorizedException("Unauthorized")
    }

}