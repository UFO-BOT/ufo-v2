import {IsOptional, IsString, MaxLength, ValidateIf, ValidateNested} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import EmbedAuthor from "@/types/embed/EmbedAuthor";

export class GuildEmbedAuthorDto implements EmbedAuthor {

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(256)
    public name: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @MaxLength(2048)
    public url?: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public iconUrl?: string

}