import Discord from 'discord.js'

import MongoDB from "@/structures/MongoDB";
import AbstractCommand from "@/abstractions/AbstractCommand";
import IGuildLanguage from "@/interfaces/GuildLanguage";
import ClientLoader from "@/util/ClientLoader";

export default class Client extends Discord.Client {
    public token: string
    public supportGuildID: string = '712012571666022411'

    public cache = {
        commands: new Discord.Collection<string, AbstractCommand>(),
        prefixes: new Discord.Collection<string, string>(),
        languages: new Discord.Collection<string, IGuildLanguage>(),
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

    load(): void {
        ClientLoader.loadEvents()
        ClientLoader.loadCommands()
    }

    async start(): Promise<any> {
        this.load()

        const mongo = new MongoDB()
        await mongo.start()
        console.log(`[CLIENT] [MONGO] MongoDB connected!`)

        await this.login(this.token)
    }
}