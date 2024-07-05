import {
    IsArray,
    IsBoolean,
    IsObject,
    IsOptional,
    IsString, Length, ValidateIf, ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {GuildLog} from "@/types/GuildLog";

class Greeting {

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(body => body.enabled)
    @IsString()
    @Length(1, 1500)
    public message: string

    @ValidateIf(body => body.enabled)
    @IsObject()
    public embed: object

}

class GuildGreeting extends Greeting {

    @ValidateIf(body => body.enabled)
    @IsString()
    public channel: string

}

export class GuildGreetingsDto {

    @IsObject()
    @ValidateNested()
    @Type(() => GuildGreeting)
    public join: GuildGreeting

    @IsObject()
    @ValidateNested()
    @Type(() => GuildGreeting)
    public leave: GuildGreeting

    @IsObject()
    @ValidateNested()
    @Type(() => Greeting)
    public dm: Greeting

    @IsArray()
    @IsString({each: true})
    public joinRoles: Array<string>

}