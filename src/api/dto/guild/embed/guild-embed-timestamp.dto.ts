import {IsDate, IsIn, IsString, Length, MaxLength, ValidateIf} from "class-validator";
import {Transform, TransformFnParams} from "class-transformer";
import EmbedFooter from "@/types/embed/EmbedFooter";
import EmbedTimestamp from "@/types/embed/EmbedTimestamp";

export class GuildEmbedTimestampDto implements EmbedTimestamp {

    @IsIn([null, "current", "custom", "template"])
    public type: null | "current" | "custom" | "template"

    @ValidateIf(timestamp => timestamp.type === 'custom')
    @IsDate()
    public date?: Date

    @ValidateIf(timestamp => timestamp.type === 'template')
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1, 30)
    public template?: string

}