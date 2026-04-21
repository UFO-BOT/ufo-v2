import {IsIn, IsInt, IsOptional, IsString} from "class-validator";
import SubscriptionType from "@/types/subscriptions/SubscriptionType";
import SubscriptionMonthsCount from "@/types/subscriptions/SubscriptionMonthsCount";
import Language from "@/types/Language";

export class PaymentDto {

    @IsOptional()
    @IsString()
    @IsIn(["standard", "premium"])
    public type?: SubscriptionType

    @IsInt()
    @IsIn([1, 3, 6, 12])
    public months: SubscriptionMonthsCount

    @IsOptional()
    @IsString()
    @IsIn(["ru", "en"])
    public language: Language

    @IsOptional()
    @IsString()
    public subscription_id?: string

}