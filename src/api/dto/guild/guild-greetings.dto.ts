import {
    IsArray,
    IsBoolean,
    IsObject,
    IsString, MaxLength, ValidateIf, ValidateNested
} from "class-validator";
import {Transform, TransformFnParams, Type} from "class-transformer";
import {GuildEmbedDto} from "@/api/dto/guild/embed/guild-embed.dto";

class Greeting {

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(body => body.enabled)
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(1500)
    public message: string

    @ValidateIf(body => body.enabled)
    @ValidateNested()
    @Type(() => GuildEmbedDto)
    @IsObject()
    public embed: GuildEmbedDto

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