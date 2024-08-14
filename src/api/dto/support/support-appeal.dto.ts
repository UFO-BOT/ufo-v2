import {ArrayMaxSize, ArrayMinSize, IsString, Length} from "class-validator";
import {Transform, TransformFnParams} from "class-transformer";

export class SupportAppealDto {

    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    @IsString({each: true})
    @Transform(({ value }: TransformFnParams) => (value as Array<string>)?.map(s => s.trim()))
    @Length(1, 500, {each: true})
    public answers: Array<string>

}