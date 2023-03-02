import {IsInt, IsOptional, Length} from "class-validator";

export class GuildItemDto {

    @Length(1, 50)
    public name: string

    @IsOptional()
    @Length(0, 200)
    public description: string

    @IsInt()
    public price: number

    @IsInt()
    public xp: number

    @IsOptional()
    @Length(15, 20)
    public addRole: string

    @IsOptional()
    @Length(15, 20)
    public removeRole: string

}