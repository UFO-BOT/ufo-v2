import {IsBoolean, IsInt} from "class-validator";

export class GuildBalancesDto {

    @IsInt()
    balance: number

    @IsBoolean()
    resetXP: boolean

}