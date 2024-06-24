import {
    IsArray,
    IsBoolean,
    IsObject,
    IsOptional,
    IsString, ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {GuildLog} from "@/types/GuildLog";

class Ignore {

    @IsArray()
    @IsString({each: true})
    public channels: Array<string>

}

export class GuildLogsDto {

    @IsObject()
    public list: GuildLog

    @ValidateNested()
    @Type(() => Ignore)
    public ignore: Ignore

}