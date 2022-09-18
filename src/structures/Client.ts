import Discord, {Awaitable, Serialized} from 'discord.js'

import MongoDB from "@/structures/MongoDB";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import ClientCacheConfig from "@/types/ClientCacheConfig";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import ClientLoader from "@/services/loaders/ClientLoader";

import emojis from '@/properties/emojis.json'
import AbstractInteraction from "@/abstractions/AbstractInteraction";

export default class Client extends Discord.Client {
    public readonly supportGuildID: string = '712012571666022411'

    public cache: ClientCacheConfig = {
        commands: new Discord.Collection<string, AbstractCommand>(),
        emojis: emojis,
        settings: new Discord.Collection<string, GuildSettingsCache>(),
        interactions: new Discord.Collection<string, AbstractInteraction>()
    }

    public constructor(token: string, options?: Discord.ClientOptions) {
        super(options);
        this.token = token;
        global.client = this;
    }

    oneShardEval<T, P>(script: (client: Discord.Client, context: Serialized<P>) => Awaitable<T>,
                       options: {context: P}): Promise<Serialized<T>> {
        return new Promise(async (resolve) => {
            let results = await this.shard!.broadcastEval(script, options)
            let result = results.find(r => !!r)
            if (result) resolve(result)
            else resolve(undefined)
        })
    }

    activity(): Discord.ClientPresence {
        return this.user.setActivity({name: `!help | ${process.env.WEBSITE}`, type: Discord.ActivityType.Watching})
    }

    load(loader: ClientLoader): void {
        console.log(`[SHARD #${this.shard.ids[0]}] [LOADERS] Loading modules...`)
        loader.loadEvents()
        loader.loadCommands()
        console.log(`[SHARD #${this.shard.ids[0]}] [LOADERS] Loaded modules`)
    }

    async start(): Promise<any> {
        const mongo = new MongoDB(process.env.DB_URL, process.env.DB_NAME)
        await mongo.initialize()
        console.log(`[SHARD #${this.shard.ids[0]}] [MONGO] MongoDB connected`);

        const loader = new ClientLoader()
        this.load(loader)

        await this.login(this.token)
    }
}