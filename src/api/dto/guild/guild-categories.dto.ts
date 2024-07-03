import {IsArray, IsBoolean, IsOptional, IsString} from "class-validator";

export class GuildCategoriesDto {

    @IsBoolean()
    public enabled: boolean

}