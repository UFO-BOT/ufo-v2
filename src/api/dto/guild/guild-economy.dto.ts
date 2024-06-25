import {IsBoolean, IsIn, IsInt, IsNumber, IsString, Length, Max, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

class WorkDto {

    @IsNumber()
    @IsInt()
    @Min(0)
    public low: number

    @IsNumber()
    @IsInt()
    public high: number

    @IsNumber()
    @IsInt()
    @Min(0)
    public cooldown: number
}

class MoneybagsDto extends WorkDto {

    @IsNumber()
    @IsInt()
    public declare low: number

}

export class GuildEconomyDto {

    @ValidateNested()
    @Type(() => WorkDto)
    public work: WorkDto

    @ValidateNested()
    @Type(() => MoneybagsDto)
    public moneybags: MoneybagsDto

    @IsString()
    @Length(0, 50)
    public moneySymbol: string

    @IsNumber()
    @IsInt()
    @Min(0)
    public minBet: number

    @IsNumber()
    @IsInt()
    @Min(0)
    @Max(100)
    public commission: number

}