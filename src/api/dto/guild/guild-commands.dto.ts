import {IsArray, IsBoolean, IsOptional, IsString} from "class-validator";

export class GuildCommandsDto {

    @IsBoolean()
    public enabled: boolean

    @IsBoolean()
    public deleteUsage: boolean

    @IsArray()
    @IsString({each: true})
    public allowedRoles: Array<string>

    @IsArray()
    @IsString({each: true})
    public forbiddenRoles: Array<string>

    @IsArray()
    @IsString({each: true})
    public allowedChannels: Array<string>

    @IsArray()
    @IsString({each: true})
    public forbiddenChannels: Array<string>

    @IsBoolean()
    @IsOptional()
    public updateSlash: boolean

}