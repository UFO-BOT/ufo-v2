import {Module} from '@nestjs/common';
import {PublicModule} from "@/api/modules/public.module";
import {PrivateModule} from "@/api/modules/private.module";
import {Oauth2Module} from "@/api/modules/oauth2.module";
import {MainController} from "@/api/controllers/main.controller";
import {APP_GUARD, RouterModule} from "@nestjs/core";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";

@Module({
  controllers: [MainController],
  imports: [PublicModule, PrivateModule, Oauth2Module,
    RouterModule.register([
    {path: "public", module: PublicModule},
    {path: "private", module: PrivateModule},
    {path: "oauth2", module: Oauth2Module}
  ]),
    ThrottlerModule.forRoot({
      limit: 30,
      ttl: 60
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
