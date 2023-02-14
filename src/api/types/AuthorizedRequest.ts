import { Request } from "@nestjs/common";
import {User} from "discord.js";

export interface AuthorizedRequest extends Request {
    user: User
}