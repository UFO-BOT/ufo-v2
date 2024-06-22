import { Request } from "@nestjs/common";

export interface AuthorizedRequest extends Request {
    token: string
    params: Record<string, string>
    user: string
}