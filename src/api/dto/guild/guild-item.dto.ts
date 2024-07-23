import {IsArray, IsInt, IsOptional, IsString, IsUrl, Length, Min, ValidateIf, ValidateNested} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";

class ItemXp {

    @IsInt()
    @Min(0)
    public min: number

    @IsInt()
    @Min(0)
    public max: number

}

export class GuildItemDto {

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1, 50)
    public name: string

    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(0, 200)
    public description: string

    @ValidateIf(body => body.thumbnailUrl?.length > 0)
    @IsOptional()
    @IsUrl()
    public thumbnailUrl: string

    @IsArray()
    @IsString({each: true})
    public requiredRoles: Array<string>

    @IsInt()
    @Min(0)
    public requiredXp: number

    @IsInt()
    @Min(0)
    public price: number

    @ValidateNested()
    @Type(() => ItemXp)
    public xp: ItemXp

    @IsOptional()
    @IsString()
    public addRole: string

    @IsOptional()
    @IsString()
    public removeRole: string

}