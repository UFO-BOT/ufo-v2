import {IsIn, IsString} from "class-validator";


export class GuildTestsGreetingsDto {

    @IsString()
    @IsIn(['join', 'leave'])
    public type: 'join' | 'leave'

}