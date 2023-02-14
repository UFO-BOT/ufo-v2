import {Controller, Get} from "@nestjs/common";
import Base from "@/abstractions/Base";

@Controller()
export class MainController extends Base {

    @Get()
    async execute() {
        return {message: "What do you want to find here?"}
    }

}