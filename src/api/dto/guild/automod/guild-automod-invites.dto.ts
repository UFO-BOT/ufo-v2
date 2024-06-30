import {GuildAutomodDto} from "@/api/dto/guild/automod/guild-automod.dto";
import {IsArray, IsString, ValidateNested} from "class-validator";
import {AutoModInvites} from "@/types/automod/AutoModInvites";
import {Type} from "class-transformer";

class AutomodInvitesParameters {

    @IsArray()
    @IsString({each: true})
    public whitelistGuilds: Array<string>

}

export class GuildAutomodInvitesDto extends GuildAutomodDto implements AutoModInvites {

    @ValidateNested()
    @Type(() => AutomodInvitesParameters)
    public declare options: AutomodInvitesParameters

}