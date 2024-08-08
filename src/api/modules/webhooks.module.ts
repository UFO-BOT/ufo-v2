import {Module} from "@nestjs/common";
import {YookassaWebhookController} from "@/api/controllers/webhooks/yookassa-webhook.controller";
import {YookassaService} from "@/api/services/yookassa.service";

@Module({
    controllers: [YookassaWebhookController],
    providers: [YookassaService]
})
export class WebhooksModule {}