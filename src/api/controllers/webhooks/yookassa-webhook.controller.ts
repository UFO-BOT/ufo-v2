import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import Base from "@/abstractions/Base";
import {Throttle} from "@nestjs/throttler";
import {YookassaWebhookDto} from "@/api/dto/yookassa-webhook.dto";
import {YookassaService} from "@/api/services/yookassa.service";

@Controller('yookassa')
@Throttle(15, 60)
export class YookassaWebhookController extends Base {

    constructor(private yookassa: YookassaService) {
        super();
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async execute(@Body() body: YookassaWebhookDto) {
        if (body.event !== 'payment.succeeded') return
        return this.yookassa.checkPayment(body.object?.id)
    }

}