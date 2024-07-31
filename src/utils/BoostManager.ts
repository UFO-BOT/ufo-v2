import Boost from "@/types/database/Boost";
import Settings from "@/types/database/Settings";
import SubscriptionType from "@/types/SubscriptionType";
import Subscription from "@/types/database/Subscription";
import constants from "@/properties/constants.json";
import {Client} from "discord.js";

export default class BoostManager {
    public static async add(userId: string, count: number): Promise<Boost> {
        let boost = await global.db.manager.findOneBy(Boost, {userid: userId}) as Boost
        if (!boost) {
            boost = new Boost()
            boost.userid = userId
            boost.count = 0
            boost.used = 0
        }
        boost.count += count
        return boost.save()
    }

    public static async remove(userId: string, count: number): Promise<Boost> {
        let boost = await global.db.manager.findOneBy(Boost, {userid: userId}) as Boost
        if (!boost) return
        boost.count -= count
        if (boost.count < 0) boost.count = 0
        let servers = await global.db.mongoManager
            .find(Settings, {where: {boostBy: userId}}) as Array<Settings>
        if (servers.length > boost.count) {
            servers = servers.slice(0, servers.length-boost.count)
            for (let server of servers) {
                server.boost = false
                server.boostBy = ''
                boost.used --
                await server.save()
                if (global.manager)
                    await global.manager.broadcastEval((client, context) =>
                        client.emit('updateCache', context.guildId), {context: {guildId: server.guildid}})
                if (global.client)
                    await global.client.shard.broadcastEval((client, context) =>
                        client.emit('updateCache', context.guildId), {context: {guildId: server.guildid}})
            }
        }
        return boost.save()
    }

    public static async subscription(userId: string, type: SubscriptionType, duration?: number, count?: number): Promise<Boost> {
        let subscription = new Subscription()
        subscription.userid = userId
        subscription.type = type
        subscription.ends = new Date(Date.now() + (duration ?? 2592000000))
        if (type === 'manager') {
            subscription.boosts = count
            await subscription.save()
            return this.add(userId, count)
        }
        let sub = constants.subscriptions[type]
        subscription.boosts = sub.boosts
        await subscription.save()
        let context = {context: {supportGuildId: constants.supportGuildId, userId, roleId: sub.role}}
        async function addRole (client: Client, context: any) {
            let member = await client.guilds.cache
                .get(context.supportGuildId)?.members?.fetch(context.userId)?.catch(() => null)
            if (member) await member.roles.add(context.roleId)
        }
        if (global.manager) await global.manager.broadcastEval(addRole, context)
        if (global.client) await global.client.shard.broadcastEval(addRole, context)
        return this.add(userId, sub.boosts)
    }
}