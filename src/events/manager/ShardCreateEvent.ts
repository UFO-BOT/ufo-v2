import Discord from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractManagerEvent from "@/abstractions/events/AbstractManagerEvent";

export default class ShardCreateEvent extends AbstractManagerEvent implements EventConfig {
    public name = 'shardCreate'

    public async execute(shard: Discord.Shard): Promise<any> {
        console.log(`[SHARDS] Shard ${shard.id} is created`)
        shard.on('ready', async () => {
            console.log(`[SHARDS] Shard ${shard.id} is ready`)
            if((global.manager.shards.filter(s => s.ready).size >= Number(global.manager.totalShards))
                && !this.manager.launched) {
                console.log(`[SHARDS] All shards have been engaged`)
                await this.manager.shards.first().eval(client => client.emit('allShardsReady'))
                this.manager.loader.loadWatchers()
                this.manager.launched = true
            }
        })
        shard.on('disconnect', () => {
            console.log(`[SHARDS] Shard ${shard.id} was disconnected`)
        })
        shard.on('reconnecting', () => {
            console.log(`[SHARDS] Shard ${shard.id} is reconnecting`)
        })
        shard.on('death', () => {
            console.log(`[SHARDS] Shard ${shard.id} is dead`)
        })
    }
}