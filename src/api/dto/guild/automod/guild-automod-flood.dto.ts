import {GuildAutomodDto} from "@/api/dto/guild/automod/guild-automod.dto";
import {IsArray, IsInt, IsString, Min, ValidateNested} from "class-validator";
import {AutoModInvites} from "@/types/automod/AutoModInvites";
import {Type} from "class-transformer";
import {AutoModFlood, AutoModFloodOptions} from "@/types/automod/AutoModFlood";

class AutomodFloodOptions implements AutoModFloodOptions {

    @IsInt()
    @Min(1)
    public messages: number

    @IsInt()
    @Min(1)
    public symbols: number

}

export class GuildAutomodFloodDto extends GuildAutomodDto implements AutoModFlood {

    @ValidateNested()
    @Type(() => AutomodFloodOptions)
    public declare options: AutomodFloodOptions

}