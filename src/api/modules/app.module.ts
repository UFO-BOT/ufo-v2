import {Module} from '@nestjs/common';
import {PublicModule} from "@/api/modules/public.module";
import {PrivateModule} from "@/api/modules/private.module";
import {RouterModule} from "@nestjs/core";
import {Oauth2Module} from "@/api/modules/oauth2.module";
import {MainController} from "@/api/controllers/main.controller";

@Module({
  controllers: [MainController],
  imports: [PublicModule, PrivateModule, Oauth2Module,
    RouterModule.register([
    {path: "public", module: PublicModule},
    {path: "private", module: PrivateModule},
    {path: "oauth2", module: Oauth2Module}
  ])]
})
export class AppModule {}
