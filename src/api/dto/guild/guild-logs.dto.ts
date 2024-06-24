import {
    IsArray,
    IsBoolean,
    IsObject,
    IsOptional,
    IsString, ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {GuildLog, GuildLogType} from "@/types/GuildLog";

class Ignore {

    @IsArray()
    @IsString({each: true})
    public channels: Array<string>

}

export class GuildLogsDto {

    @IsObject()
    public list: Record<GuildLogType, GuildLog>

    @ValidateNested()
    @Type(() => Ignore)
    public ignore: Ignore

}