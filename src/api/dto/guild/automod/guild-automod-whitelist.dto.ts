import AutoMod from "@/types/automod/AutoMod";
import {IsArray, IsString} from "class-validator";
import AutoModWhitelist from "@/types/automod/AutoModWhitelist";

export class GuildAutomodWhitelistDto implements AutoModWhitelist {

    @IsArray()
    @IsString({each: true})
    public roles: Array<string>

    @IsArray()
    @IsString({each: true})
    public channels: Array<string>

}