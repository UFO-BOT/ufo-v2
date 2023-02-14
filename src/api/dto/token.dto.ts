import {IsString} from "class-validator";

export class TokenDto {

    @IsString()
    public redirectURI: string

    @IsString()
    public code: string

}