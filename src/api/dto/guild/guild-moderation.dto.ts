import {
    IsArray,
    IsBoolean, IsIn, IsInt, IsNumber,
    IsObject,
    IsOptional,
    IsString, Min, ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {GuildLog} from "@/types/GuildLog";
import ModerationAction from "@/services/moderation/ModerationAction";

class Punishment {

    @IsString()
    @IsIn(['mute', 'kick', 'ban'])
    public type: string

    @IsOptional()
    @IsNumber()
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

export class GuildModerationDto {

    @IsString()
    public muteRole: string

    @IsBoolean()
    public useTimeout: boolean

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => WarnsPunishment)
    public warnsPunishments: Array<WarnsPunishment>

}