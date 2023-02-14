import {Module, Scope, UseGuards} from "@nestjs/common";
import {TokenController} from "@/api/controllers/oauth2/token.controller";
import {Oauth2Service} from "@/api/services/oauth2.service";

@Module({
    controllers: [TokenController],
    providers: [Oauth2Service]
})
export class Oauth2Module {}