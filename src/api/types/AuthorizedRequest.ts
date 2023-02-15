import { Request } from "@nestjs/common";
import {RawUserData} from "discord.js/typings/rawDataTypes";

export interface AuthorizedRequest extends Request {
    params: Record<string, string>
    user: RawUserData
}