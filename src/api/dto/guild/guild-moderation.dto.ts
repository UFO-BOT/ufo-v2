import {
    IsArray,
    IsBoolean,
    IsObject,
    IsOptional,
    IsString, ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {GuildLog} from "@/types/GuildLog";

export class GuildModerationDto {

    @IsString()
    public muteRole: string

    @IsBoolean()
    public useTimeout: boolean

}