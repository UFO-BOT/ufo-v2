import Discord, {Awaitable, Collection, Serialized} from "discord.js";

import MongoDB from "@/structures/MongoDB";

import ManagerLoader from "@/services/loaders/ManagerLoader"
import ManagerCacheConfig from "@/types/ManagerCacheConfig";
import TokenCache from "@/types/TokenCache";

export default class Manager extends Discord.ShardingManager {
    public constructor(file: string, options?: any) {
        super(file, options);
        this.file = file;
        global.manager = this;
    }

    public cache: ManagerCacheConfig = {
        tokens: new Collection<string, TokenCache>()
    }

    public loader: ManagerLoader
    public launched = false

    oneShardEval<T, P>(script: (client: Discord.Client, context: Serialized<P>) => Awaitable<T>,
                       options?: {context: P}): Promise<Serialized<T>> {
        return new Promise(async (resolve) => {
            let results = await this.broadcastEval(script, options)
            let result = results.find(r => !!r)
            if (result) resolve(result)
            else resolve(undefined)
        })
    }

    public processEvents(): void {
        process.on('unhandledRejection', reason => {
            console.log(reason);
        })

        process.on('uncaughtException', err => {
            console.log(err);
        })
    }

    public load() {
        this.loader.loadEvents()
        this.processEvents()
    }

    async start(): Promise<any> {
        const mongo = new MongoDB(process.env.DB_URL, process.env.DB_NAME)
        await mongo.initialize()
        console.log(`[MANAGER] [MONGO] MongoDB connected!`)

        this.loader = new ManagerLoader();
        this.load()

        await this.spawn()
    }
}