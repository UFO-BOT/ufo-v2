import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {Oauth2Service} from "@/api/services/oauth2.service";

@Injectable()
export class AuthGuard extends Base implements CanActivate {

    constructor(private oauth2: Oauth2Service) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        let token = request.header("Authorization")
        if (!token) throw new UnauthorizedException("Unauthorized")
        let user = await this.oauth2.getUser(token)
        request.token = token;
        request.user = user;
        if(user) return true;
        else throw new UnauthorizedException("Unauthorized")
    }

}