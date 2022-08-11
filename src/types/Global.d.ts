import Discord from "discord.js";
import {DataSource} from "typeorm";

import Client from '@/structures/Client'
import Manager from "@/structures/Manager";

declare global {
    namespace NodeJS {
        interface Global {
            client: Client
            manager: Manager
            mongo: DataSource
            Discord: Discord
        }

        interface ProcessEnv {
            TOKEN: string
            TOTAL_SHARDS: number
            DB_URL: string
            DB_NAME: string
            WEBSITE: string
            BOT_INVITE: string
            SUPPORT_SERVER: string
            SYSTEM_COLOR: `#${string}`
        }
    }
}