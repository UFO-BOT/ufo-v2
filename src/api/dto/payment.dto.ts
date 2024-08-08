import {IsIn, IsOptional, IsString} from "class-validator";
import SubscriptionType from "@/types/SubscriptionType";
import Language from "@/types/Language";

export class PaymentDto {

    @IsString()
    @IsIn(["standard", "premium"])
    public type: SubscriptionType

    @IsOptional()
    @IsString()
    @IsIn(["ru", "en"])
    public language: Language

}