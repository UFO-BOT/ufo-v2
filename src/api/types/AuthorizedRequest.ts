import { Request } from "@nestjs/common";
import {RawUserData} from "discord.js/typings/rawDataTypes";

export interface AuthorizedRequest extends Request {
    token: string
    params: Record<string, string>
    user: RawUserData
}