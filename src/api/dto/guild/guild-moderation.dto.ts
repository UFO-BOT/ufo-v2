import {
    IsArray,
    IsBoolean, IsIn, IsInt,
    IsObject,
    IsOptional,
    IsString, MaxLength, Min, ValidateIf, ValidateNested
} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import {GuildEmbedDto} from "@/api/dto/guild/embed/guild-embed.dto";

class Punishment {

    @IsString()
    @IsIn(['mute', 'kick', 'ban'])
    public type: string

    @IsOptional()
    @IsInt()
    @Min(0)
    duration?: number

}

class WarnsPunishment {

    @IsInt()
    @Min(1)
    public warns: number

    @IsObject()
    @ValidateNested()
    @Type(() => Punishment)
    public punishment: Punishment

}

class PunishmentMessage {

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(body => body.enabled)
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(1500)
    public message: string

    @ValidateIf(body => body.enabled)
    @ValidateNested()
    @Type(() => GuildEmbedDto)
    @IsObject()
    public embed: GuildEmbedDto

}

class GuildPunishmentMessages {

    @ValidateNested()
    @Type(() => PunishmentMessage)
    public kick: PunishmentMessage

    @ValidateNested()
    @Type(() => PunishmentMessage)
    public ban: PunishmentMessage

}

export class GuildModerationDto {

    @IsString()
    public muteRole: string

    @IsBoolean()
    public useTimeout: boolean

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => WarnsPunishment)
    public warnsPunishments: Array<WarnsPunishment>

    @ValidateNested()
    @Type(() => GuildPunishmentMessages)
    public punishmentMessages: GuildPunishmentMessages

}