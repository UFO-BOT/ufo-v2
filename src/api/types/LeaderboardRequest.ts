import {AuthorizedRequest} from "@/api/types/AuthorizedRequest";
import {GuildInfo} from "@/api/types/GuildInfo";

export interface LeaderboardRequest extends AuthorizedRequest {
    guild: GuildInfo
}