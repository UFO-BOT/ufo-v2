import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthorizedRequest} from "@/api/types/AuthorizedRequest";
import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {Throttle} from "@nestjs/throttler";
import {PaymentDto} from "@/api/dto/payment.dto";
import {YookassaService} from "@/api/services/yookassa.service";

@Controller('payments')
@Throttle(15, 60)
@UseGuards(AuthGuard)
export class PaymentsController extends Base {

    constructor(private yookassa: YookassaService) {
        super();
    }

    @Post()
    async execute(@Req() request: AuthorizedRequest, @Body() body: PaymentDto) {
        let payment = await this.yookassa.createPayment(request.user, body.type, body.language)
        return {confirmationUrl: payment.confirmation.confirmation_url}
    }

}