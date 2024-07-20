import Discord, {Awaitable, ClientOptions, ClientPresence, Collection, Serialized, Snowflake} from 'discord.js'

import MongoDB from "@/structures/MongoDB";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import ClientCacheConfig from "@/types/ClientCacheConfig";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import ClientLoader from "@/services/loaders/ClientLoader";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import AutomodDetectionsCache from "@/types/automod/AutomodDetectionsCache";

import emojis from '@/properties/emojis.json'

export default class Client extends Discord.Client {
    public readonly supportGuildID: string = '712012571666022411'

    public cache: ClientCacheConfig = {
        commands: new Collection<string, AbstractCommand>(),
        emojis: emojis,
        settings: new Collection<string, GuildSettingsCache>(),
        interactions: new Collection<string, AbstractInteraction>(),
        detections: new Collection<Snowflake, Record<Snowflake, AutomodDetectionsCache>>(),
        executing: {
            moderation: new Set<Snowflake>(),
            giveaways: new Set<Snowflake>()
        }
    }

    public constructor(token: string, options?: ClientOptions) {
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

    activity(): ClientPresence {
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