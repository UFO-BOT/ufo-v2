import {GuildAutomodDto} from "@/api/dto/guild/automod/guild-automod.dto";
import {IsArray, IsString, ValidateNested} from "class-validator";
import {AutoModInvites, AutoModInvitesOptions} from "@/types/automod/AutoModInvites";
import {Type} from "class-transformer";

class AutomodInvitesOptions implements AutoModInvitesOptions {

    @IsArray()
    @IsString({each: true})
    public whitelistGuilds: Array<string>

}

export class GuildAutomodInvitesDto extends GuildAutomodDto implements AutoModInvites {

    @ValidateNested()
    @Type(() => AutomodInvitesOptions)
    public declare options: AutomodInvitesOptions

}