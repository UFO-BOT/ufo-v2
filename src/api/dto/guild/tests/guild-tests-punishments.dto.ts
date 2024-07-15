import {IsIn, IsString} from "class-validator";


export class GuildTestsPunishmentsDto {

    @IsString()
    @IsIn(['kick', 'ban'])
    public type: 'kick' | 'ban'

}