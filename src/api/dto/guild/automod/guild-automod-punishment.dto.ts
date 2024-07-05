import AutoMod from "@/types/automod/AutoMod";
import {
    IsBoolean,
    IsIn,
    IsInt,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    ValidateIf,
    ValidateNested
} from "class-validator";
import AutoModPunishment from "@/types/automod/AutoModPunishment";
import ModAction from "@/types/ModAction";

export class GuildAutomodPunishmentDto implements AutoModPunishment {

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(punishment => punishment.enabled)
    @IsString()
    @IsIn(['warn', 'mute', 'kick', 'ban'])
    public type?: ModAction.Warn | ModAction.Mute | ModAction.Kick | ModAction.Ban

    @ValidateIf(punishment => punishment.enabled)
    @IsOptional()
    @IsInt()
    @Min(0)
    public duration?: number

    @ValidateIf(punishment => punishment.enabled)
    @IsOptional()
    @IsString()
    @MaxLength(512)
    public reason?: string

}