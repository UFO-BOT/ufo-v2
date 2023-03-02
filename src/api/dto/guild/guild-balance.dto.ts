import {IsBoolean, IsInt} from "class-validator";

export class GuildBalanceDto {

    @IsInt()
    balance: number

    @IsBoolean()
    resetXP: boolean

}