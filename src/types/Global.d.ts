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
            SECRET: string
            YOOKASSA_SHOP_ID: string
            YOOKASSA_TOKEN: string
            TOTAL_SHARDS: number
            PORT: number
            DB_URL: string
            DB_NAME: string
            DISCORD_API: string
            YOOKASSA_API: string
            WEBSITE: string
            SUPPORT_SERVER: string
            WEBHOOK_SERVERS: string
            WEBHOOK_DONATE: string
            WEBHOOK_REQUESTS: string
        }
    }
}