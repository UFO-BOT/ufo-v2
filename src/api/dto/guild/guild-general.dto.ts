import {IsBoolean, IsIn, IsString, Length, ValidateNested} from "class-validator";
import GuildLanguage from "@/types/GuildLanguage";
import {Type} from "class-transformer";
import Language from "@/types/Language";

class GuildLanguageDto implements GuildLanguage {

    @IsString()
    @IsIn(["ru", "en"])
    public commands: Language

    @IsString()
    @IsIn(["ru", "en"])
    public interface: Language

}

export class GuildGeneralDto {

    @IsString()
    @Length(1, 20)
    public prefix: string

    @ValidateNested()
    @Type(() => GuildLanguageDto)
    public language: GuildLanguageDto

}