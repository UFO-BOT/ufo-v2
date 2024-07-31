import Discord, {Awaitable, Serialized} from "discord.js";

import MongoDB from "@/structures/MongoDB";

import ManagerLoader from "@/services/loaders/ManagerLoader"

export default class Manager extends Discord.ShardingManager {
    public constructor(file: string, options?: any) {
        super(file, options);
        this.file = file;
        global.manager = this;
    }

    public loader: ManagerLoader

    oneShardEval<T, P>(script: (client: Discord.Client, context: Serialized<P>) => Awaitable<T>,
                       options?: {context: P}): Promise<Serialized<T>> {
        return new Promise(async (resolve) => {
            let results = await this.broadcastEval(script, options)
            let result = results.find(r => !!r)
            if (result) resolve(result)
            else resolve(undefined)
        })
    }

    load() {
        this.loader.loadEvents()
    }

    loadWatchers() {
        this.loader.loadWatchers()
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