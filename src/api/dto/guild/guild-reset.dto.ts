import {ArrayMinSize, IsArray, IsString} from "class-validator";



export class GuildResetDto {

    @IsString()
    public name: string

    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1)
    public scopes: Array<string>
}