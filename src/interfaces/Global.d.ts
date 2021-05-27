import Discord from "discord.js";

import Client from '@/structures/Client'
import Manager from "@/structures/Manager";
import MongoDB from "@/structures/MongoDB";

declare global {
    namespace NodeJS {
        interface Global {
            bot: Client
            manager: Manager
            mongo: MongoDB
            Discord: Discord
        }

        interface ProcessEnv {
            TOKEN: string
            TOTAL_SHARDS: number
            DB_URL: string
            DB_NAME: string
        }
    }
}