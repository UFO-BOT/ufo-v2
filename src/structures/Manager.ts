import Discord from "discord.js";

import ManagerLoader from "@/utils/loaders/ManagerLoader";
import Settings from "@/types/database/Settings";
import MongoDB from "@/services/MongoDB";


export default class Manager extends Discord.ShardingManager {
    public readonly supportGuildID: string = '712012571666022411'

    public constructor(file: string, options?: any) {
        super(file, options);
        this.file = file;
        global.manager = this;
    }

    /*oneShardEval(script: string): Promise<any> {
        return new Promise(async (resolve) => {
            let results = await this.broadcastEval(script)
            let result = results.find(r => !!r)
            if (result) resolve(result)
            else resolve(undefined)
        })
    }*/

    load() {
        ManagerLoader.loadEvents()
    }

    async start(): Promise<any> {
        const mongo = new MongoDB(process.env.DB_URL)
        await mongo.connect()
        console.log(`[MANAGER] [MONGO] MongoDB connected!`) 

        this.load()

        await this.spawn()
    }
}