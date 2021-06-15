import Discord from 'discord.js'

import MongoDB from "@/structures/MongoDB";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import ClientCacheConfig from "@/types/ClientCacheConfig";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import ClientLoader from "@/utils/loaders/ClientLoader";

import emojis from '@/properties/emojis.json'

export default class Client extends Discord.Client {
    public token: string
    public supportGuildID: string = '712012571666022411'

    public cache: ClientCacheConfig = {
        commands: new Discord.Collection<string, AbstractCommand>(),
        devCommands: new Discord.Collection<string, AbstractDevCommand>(),
        emojis: emojis,
        settings: new Discord.Collection<string, GuildSettingsCache>()
    }

    public constructor(token: string, options?: Discord.ClientOptions) {
        super(options);
        this.token = token;
        global.bot = this;
    }

    oneShardEval(script: string): Promise<any> {
        return new Promise(async (resolve) => {
            let results = await this.shard!.broadcastEval(script)
            let result = results.find(r => !!r)
            if (result) resolve(result)
            else resolve(undefined)
        })
    }

    activity(): Promise<Discord.Presence> {
        return this.user.setActivity({name: `!help | ${process.env.WEBSITE}`, type: 'WATCHING'})
    }

    load(): void {
        console.log(`[SHARD #${global.bot.shard.ids[0]}] [LOADERS] Loading modules...`)
        ClientLoader.loadEvents()
        ClientLoader.loadCommands()
        console.log(`[SHARD #${global.bot.shard.ids[0]}] [LOADERS] Loaded modules`)
    }

    async start(): Promise<any> {
        const mongo = new MongoDB()
        await mongo.start()
        console.log(`[SHARD #${global.bot.shard.ids[0]}] [MONGO] MongoDB connected`)

        this.load()

        await this.login(this.token)
    }
}