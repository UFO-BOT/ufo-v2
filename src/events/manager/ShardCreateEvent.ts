import Discord from "discord.js";

import IEvent from "@/types/EventConfig";
import AbstractManagerEvent from "@/abstractions/events/AbstractManagerEvent";

export default class ShardCreateEvent extends AbstractManagerEvent implements IEvent {
    public name = 'shardCreate'

    public async execute(shard: Discord.Shard): Promise<any> {
        console.log(`[SHARDS] Shard ${shard.id} is created`)
        shard.on('ready', () => {
            console.log(`[SHARDS] Shard ${shard.id} is ready`)
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