import Discord from 'discord.js'

import MongoDB from "@/structures/MongoDB";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import IGuildLanguage from "@/interfaces/GuildLanguage";
import IClientCache from "@/interfaces/ClientCacheInterface";
import ICommandSettings from "@/interfaces/CommandSettings";
import ClientLoader from "@/utils/loaders/ClientLoader";

import emojis from '@/properties/emojis.json'

export default class Client extends Discord.Client {
    public token: string
    public supportGuildID: string = '712012571666022411'

    public cache:IClientCache = {
        commands: new Discord.Collection<string, AbstractCommand>(),
        devCommands: new Discord.Collection<string, AbstractDevCommand>(),
        emojis: emojis,
        prefixes: new Discord.Collection<string, string>(),
        languages: new Discord.Collection<string, IGuildLanguage>(),
        commandsSettings: new Discord.Collection<string, Record<string, ICommandSettings>>(),
        moneysymbs: new Discord.Collection<string, string>()
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