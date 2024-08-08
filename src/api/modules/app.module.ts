import {Module} from '@nestjs/common';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {PublicModule} from "@/api/modules/public.module";
import {PrivateModule} from "@/api/modules/private.module";
import {Oauth2Module} from "@/api/modules/oauth2.module";
import {MainController} from "@/api/controllers/main.controller";
import {WebhooksModule} from "@/api/modules/webhooks.module";
import {APP_GUARD, RouterModule} from "@nestjs/core";
import {ShardsGuard} from "@/api/guards/shards.guard";

@Module({
  controllers: [MainController],
  imports: [PublicModule, PrivateModule, Oauth2Module, WebhooksModule,
    RouterModule.register([
      {path: "public", module: PublicModule},
      {path: "private", module: PrivateModule},
      {path: "oauth2", module: Oauth2Module},
      {path: "webhooks", module: WebhooksModule}
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
    },
    {
      provide: APP_GUARD,
      useClass: ShardsGuard
    }
  ]
})
export class AppModule {}
