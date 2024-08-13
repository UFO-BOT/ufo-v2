import {ArrayMaxSize, ArrayMinSize, IsString, Length} from "class-validator";

export class SupportAppealDto {

    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    @IsString({each: true})
    @Length(1, 500, {each: true})
    public answers: Array<string>

}