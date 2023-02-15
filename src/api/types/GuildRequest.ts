import {AuthorizedRequest} from "@/api/types/AuthorizedRequest";
import {GuildData} from "@/api/types/GuildData";

export interface GuildRequest extends AuthorizedRequest {
    guild: GuildData
}