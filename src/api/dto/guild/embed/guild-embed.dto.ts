import {
    IsArray,
    IsBoolean,
    IsHexColor,
    IsOptional,
    IsString, MaxLength, Validate,
    ValidateIf,
    ValidateNested
} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import Embed from "@/types/embed/Embed";
import {GuildEmbedAuthorDto} from "@/api/dto/guild/embed/guild-embed-author.dto";
import {GuildEmbedFooterDto} from "@/api/dto/guild/embed/guild-embed-footer.dto";
import {GuildEmbedFieldDto} from "@/api/dto/guild/embed/guild-embed-field.dto";
import {GuildEmbedTimestampDto} from "@/api/dto/guild/embed/guild-embed-timestamp.dto";

export class GuildEmbedDto implements Embed{

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsHexColor()
    public color: `#${string}`

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @ValidateNested()
    @Type(() => GuildEmbedAuthorDto)
    public author: GuildEmbedAuthorDto

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(256)
    public title: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public url: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public description: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => GuildEmbedFieldDto)
    public fields: Array<GuildEmbedFieldDto>

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public image: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(2048)
    public thumbnail: string

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @ValidateNested()
    @Type(() => GuildEmbedFooterDto)
    public footer: GuildEmbedFooterDto

    @ValidateIf(body => body.enabled)
    @IsOptional()
    @ValidateNested()
    @Type(() => GuildEmbedTimestampDto)
    public timestamp: GuildEmbedTimestampDto

}