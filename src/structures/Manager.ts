import Discord from "discord.js";

import MongoDB from "@/structures/MongoDB";
import ManagerLoader from "@/utils/ManagerLoader";


export default class Manager extends Discord.ShardingManager {
    public file: string
    public supportGuildID: string = '712012571666022411'

    public constructor(file: string, options?: any) {
        super(file, options);
        this.file = file;
        global.manager = this;
    }

    oneShardEval(script: string): Promise<any> {
        return new Promise(async (resolve) => {
            let results = await this.broadcastEval(script)
            let result = results.find(r => !!r)
            if (result) resolve(result)
            else resolve(undefined)
        })
    }

    load() {
        ManagerLoader.loadEvents()
    }

    async start(): Promise<any> {
        this.load()

        const mongo = new MongoDB()
        await mongo.start()
        console.log(`[MANAGER] [MONGO] MongoDB connected!`)

        await this.spawn(this.totalShards)
    }
}