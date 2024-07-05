import {
    IsBoolean,
    IsOptional,
    IsString, Length,
    MaxLength,
    ValidateIf,
} from "class-validator";
import AutoModMessage from "@/types/automod/AutoModMessage";

export class GuildAutomodMessageDto implements AutoModMessage {

    @IsBoolean()
    public enabled: boolean

    @ValidateIf(message => message.enabled)
    @IsOptional()
    @IsString()
    public channel?: string

    @ValidateIf(message => message.enabled)
    @IsString()
    @Length(1, 1500)
    public template?: string

}