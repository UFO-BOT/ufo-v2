import {Controller, Get} from "@nestjs/common";
import Base from "@/abstractions/Base";
import Balance from "@/types/database/Balance";

interface ShardStats {
    id: number
    ready: boolean
    guilds: number
    users: number
    channels: number
    emojis: number
    ping: number
    memory: number
}

@Controller('stats')
export class StatsController extends Base {

    @Get()
    async execute() {
        let DBPing = Date.now();
        await this.db.manager.findOneBy(Balance, {});
        DBPing = Date.now() - DBPing;
        let shards: Array<ShardStats> = []
        for (let shard of this.manager.shards.map(s => s)) shards.push({
            id: shard.id,
            ready: shard.ready,
            guilds: await shard.eval(client => client.guilds.cache.size),
            users: await shard.eval(client => client.users.cache.size),
            channels: await shard.eval(client => client.channels.cache.size),
            emojis: await shard.eval(client => client.emojis.cache.size),
            ping: await shard.eval(client => client.ws.ping),
            memory: await shard.eval(() => Math.round(process.memoryUsage().heapUsed / 1024 ** 2)),
        })
        return {
            stats: {
                guilds: shards.map(shard => shard.guilds).reduce((a, b) => a + b, 0),
                users: shards.map(shard => shard.users).reduce((a, b) => a + b, 0),
                channels: shards.map(shard => shard.channels).reduce((a, b) => a + b, 0),
                emojis: shards.map(shard => shard.emojis).reduce((a, b) => a + b, 0)
            },
            shards,
            totalShards: this.manager.totalShards,
            ping: {
                bot: Math.round(shards.map(s => s.ping).reduce((a, b) => a + b, 0) / shards.length),
                database: DBPing
            }
        }
    }

}