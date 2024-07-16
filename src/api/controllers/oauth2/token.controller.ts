import {Body, Controller, Post, Patch, Delete, Headers} from "@nestjs/common";
import {Throttle} from "@nestjs/throttler";
import Base from "@/abstractions/Base";
import {TokenDto} from "@/api/dto/token.dto";
import {Oauth2Service} from "@/api/services/oauth2.service";
import {RefreshTokenDto} from "@/api/dto/refresh-token.dto";

@Controller("token")
@Throttle(3, 600)
export class TokenController extends Base {

    constructor(private oauth2: Oauth2Service) {
        super();
    }

    @Post()
    async token(@Body() body: TokenDto) {
        let clientID = await this.manager.shards.first().eval(client => client.user.id);
        return this.oauth2.getAccessToken(clientID as string, body.redirectURI, body.code);
    }

    @Patch("/refresh")
    async refresh(@Body() body: RefreshTokenDto) {
        let clientID = await this.manager.shards.first().eval(client => client.user.id);
        return this.oauth2.refreshToken(clientID as string, body.refreshToken);
    }

    @Delete("/revoke")
    async revoke(@Headers("Authorization") token: string) {
        let clientID = await this.manager.shards.first().eval(client => client.user.id);
        await this.oauth2.revokeToken(clientID as string, token)
        return {message: "Access token revoked successfully"}
    }
}