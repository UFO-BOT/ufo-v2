import {IsIn, IsInt, IsOptional, IsString, Min} from "class-validator";

export class LeaderboardDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1

    @IsOptional()
    @IsString()
    @IsIn(['balance', 'xp'])
    sort?: 'balance' | 'xp' = 'balance'

}