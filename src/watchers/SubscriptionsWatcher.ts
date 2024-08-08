import {WebhookClient} from "discord.js";
import AbstractWatcher from "@/abstractions/AbstractWatcher";
import Subscription from "@/types/database/Subscription";
import BoostManager from "@/utils/BoostManager";

export default class SubscriptionsWatcher extends AbstractWatcher {
    public interval = 3600000

    public async execute(): Promise<any> {
        let subscriptions = await this.db.mongoManager
            .find(Subscription, {where: {ends: {$lte: new Date()}}}) as Array<Subscription>
        for (let subscription of subscriptions) {
            await BoostManager.remove(subscription.userid, subscription.boosts)
            if (subscription.type === 'manager') {
                await subscription.remove()
                continue
            }
            let prop = this.constants.subscriptions[subscription.type]
            let cnt = await this.db.manager.countBy(Subscription, {userid: subscription.userid, type: subscription.type})
            if (cnt <= 1) await this.manager.broadcastEval(async (client, context) => {
                let member = await client.guilds.cache
                    .get(context.supportGuildId)?.members?.fetch(context.userId)?.catch(() => null)
                if (member) await member.roles.remove(context.roleId)
            }, {context: {supportGuildId: this.constants.supportGuildId, userId: subscription.userid, roleId: prop.role}})
            await subscription.remove()
            let hook = new WebhookClient({id: '774950339266740235', token: process.env.WEBHOOK_DONATE})
            await hook.send({content: `Закончилась ${subscription.type === 'premium' ?
                    'премиум' : 'стандартная'} подписка для <@${subscription.userid}>`})
        }
    }
}