import {
    IsBoolean,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import GuildMessageXp from "@/types/GuildMessageXp";

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

class MessageXp implements GuildMessageXp {

    @IsInt()
    @Min(0)
    @Max(100)
    public chance: number

    @IsInt()
    @Min(0)
    public min: number

    @IsInt()
    @Min(0)
    public max: number

}

class MoneyBonuses {

    @IsInt()
    @Min(0)
    public daily: number

    @IsInt()
    @Min(0)
    public weekly: number

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

    @IsOptional()
    @ValidateNested()
    @Type(() => MessageXp)
    public messageXp: MessageXp

    @IsOptional()
    @ValidateNested()
    @Type(() => MoneyBonuses)
    public moneyBonuses: MoneyBonuses

}