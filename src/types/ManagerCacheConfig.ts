import {Collection} from "discord.js";
import TokenCache from "@/types/TokenCache";

export default interface ManagerCacheConfig {
    tokens: Collection<string, TokenCache>
}