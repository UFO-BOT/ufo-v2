import Discord, {Awaitable, Serialized} from 'discord.js'

import MongoDB from "@/services/MongoDB";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDevCommand from "../../deleted/AbstractDevCommand";
import ClientCacheConfig from "@/types/ClientCacheConfig";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import ClientLoader from "@/utils/loaders/ClientLoader";

import emojis from '@/properties/emojis.json'

export default class Client extends Discord.Client {
    public readonly supportGuildID: string = '712012571666022411'

    public cache: ClientCacheConfig = {
        commands: new Discord.Collection<string, AbstractCommand>(),
        devCommands: new Discord.Collection<string, AbstractDevCommand>(),
        emojis: emojis,
        settings: new Discord.Collection<string, GuildSettingsCache>()
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

    load(): void {
        console.log(`[SHARD #${global.client.shard.ids[0]}] [LOADERS] Loading modules...`)
        ClientLoader.loadEvents()
        ClientLoader.loadCommands()
        console.log(`[SHARD #${global.client.shard.ids[0]}] [LOADERS] Loaded modules`)
    }

    async start(): Promise<any> {
        console.log(`[SHARD #${global.client.shard.ids[0]}] [MONGO] MongoDB connected`);

        this.load()

        await this.login(this.token)
    }
}