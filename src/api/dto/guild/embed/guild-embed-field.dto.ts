import {IsBoolean, IsOptional, IsString, Length, MaxLength,} from "class-validator";
import {Transform, TransformFnParams} from "class-transformer";
import EmbedField from "@/types/embed/EmbedField";

export class GuildEmbedFieldDto implements EmbedField {

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1, 256)
    public name: string

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1, 1024)
    public value: string

    @IsOptional()
    @IsBoolean()
    @IsOptional()
    public inline?: boolean

}