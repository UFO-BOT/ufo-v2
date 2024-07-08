import {IsOptional, IsString, MaxLength, ValidateIf} from "class-validator";
import {Transform, TransformFnParams} from "class-transformer";
import EmbedFooter from "@/types/embed/EmbedFooter";

export class GuildEmbedFooterDto implements EmbedFooter {

    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public text: string

    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public iconUrl?: string

}