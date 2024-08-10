import {
    IsArray, IsBoolean,
    IsInt, IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    MaxLength,
    Min,
    ValidateIf,
    ValidateNested
} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import GuildCustomJob from "@/types/GuildCustomJob";

class Salary {

    @IsNumber()
    @IsInt()
    public min: number

    @IsNumber()
    @IsInt()
    public max: number

}

export class GuildCustomJobDto implements GuildCustomJob {

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1, 50)
    public name: string

    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(0, 1000)
    public description: string

    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(1500)
    public message: string

    @IsBoolean()
    @IsOptional()
    public hideOptions: boolean

    @ValidateIf(body => body.iconUrl?.length > 0)
    @IsOptional()
    @IsUrl()
    public iconUrl: string

    @ValidateNested()
    @Type(() => Salary)
    public salary: Salary

    @IsNumber()
    @IsInt()
    @Min(0)
    public cooldown: number

    @IsInt()
    @Min(0)
    public requiredXp: number

    @IsArray()
    @IsString({each: true})
    public requiredRoles: Array<string>

}