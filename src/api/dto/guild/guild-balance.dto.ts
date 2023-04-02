import {IsBoolean, IsInt} from "class-validator";

export class GuildBalanceDto {

    @IsInt()
    public balance: number

    @IsBoolean()
    public resetXP: boolean

}