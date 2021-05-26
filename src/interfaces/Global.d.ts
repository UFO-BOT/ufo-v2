import Discord from "discord.js";

import Client from '@/structures/Client'
import Manager from "@/structures/Manager";
import Database from "@/structures/Database";

declare global {
    namespace NodeJS {
        interface Global {
            bot: Client
            manager: Manager
            mongo: Database
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