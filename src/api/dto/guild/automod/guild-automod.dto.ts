import {IsBoolean, IsInt, IsObject, ValidateIf, ValidateNested} from "class-validator";
import AutoMod from "@/types/automod/AutoMod";
import {Type} from "class-transformer";
import {GuildAutomodPunishmentDto} from "@/api/dto/guild/automod/guild-automod-punishment.dto";
import {GuildAutomodWhitelistDto} from "@/api/dto/guild/automod/guild-automod-whitelist.dto";

export class GuildAutomodDto implements AutoMod {

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(body => body.enabled)
    @IsBoolean()
    public deleteMessages: boolean

    @ValidateIf(body => body.enabled)
    @IsObject()
    @ValidateNested()
    @Type(() => GuildAutomodPunishmentDto)
    public punishment: GuildAutomodPunishmentDto

    @ValidateIf(body => body.enabled)
    @IsObject()
    @ValidateNested()
    @Type(() => GuildAutomodWhitelistDto)
    public whitelist: GuildAutomodWhitelistDto

    @ValidateIf(body => body.enabled)
    @IsObject()
    public options: object

}