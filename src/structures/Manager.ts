import Discord from "discord.js";

import MongoDB from "@/structures/MongoDB";
import Constants from "@/types/Constants";

import constants from '@/properties/constants.json'
import ManagerLoader from "@/utils/loaders/ManagerLoader";

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
        const mongo = new MongoDB(process.env.DB_URL, process.env.DB_NAME)
        await mongo.initialize()
        global.constants = constants as Constants;
        console.log(`[MANAGER] [MONGO] MongoDB connected!`) 

        this.load()

        await this.spawn()
    }
}