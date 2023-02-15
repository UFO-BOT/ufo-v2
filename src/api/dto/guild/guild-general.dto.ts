import {IsIn, IsString, Length, ValidateNested} from "class-validator";
import GuildLanguage from "@/types/GuildLanguage";
import {Type} from "class-transformer";

class GuildLanguageDto implements GuildLanguage {

    @IsString()
    @IsIn(["ru", "en"])
    public commands: "ru" | "en"

    @IsString()
    @IsIn(["ru", "en"])
    public interface: "ru" | "en"

}

export class GuildGeneralDto {

    @IsString()
    @Length(1, 20)
    public prefix: string

    @ValidateNested()
    @Type(() => GuildLanguageDto)
    public language: GuildLanguageDto

}