import {IsObject, IsString} from "class-validator";
import {YookassaPayment} from "@/api/types/YookassaPayment";

export class YookassaWebhookDto {

    @IsString()
    public type: string

    @IsString()
    public event: string

    @IsObject()
    public object: YookassaPayment

}