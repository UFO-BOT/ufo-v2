import Client from '@/structures/Client'
import Manager from "@/structures/Manager";
import MongoDB from "@/structures/MongoDB";

declare global {
    namespace NodeJS {
        interface Global {
            client: Client
            manager: Manager
            db: MongoDB
        }

        interface ProcessEnv {
            TOKEN: string
            TOTAL_SHARDS: number
            DB_URL: string
            DB_NAME: string
            WEBSITE: string
            BOT_INVITE: string
            SUPPORT_SERVER: string
        }
    }
}