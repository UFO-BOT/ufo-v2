import {WebhookClient} from "discord.js";

import AbstractWatcher from "@/abstractions/AbstractWatcher";
import Subscription from "@/types/database/Subscription";
import BoostManager from "@/utils/BoostManager";

export default class SubscriptionsWatcher extends AbstractWatcher {
    public interval = 3600000

    public async execute(): Promise<any> {
        let expiredSubscriptions = await this.db.mongoManager
            .find(Subscription, {where: {ends: {$lte: new Date()}}}) as Array<Subscription>
        for (let expired of expiredSubscriptions) {
            await BoostManager.remove(expired.userid, expired.boosts)
            if (expired.type === 'manager') {
                await expired.remove()
                continue
            }

            let prop = this.constants.subscriptions[expired.type]
            let cnt = await this.db.manager.countBy(Subscription, {userid: expired.userid, type: expired.type})
            if (cnt <= 1) await this.manager.broadcastEval(async (client, context): Promise<void> => {
                let member = await client.guilds.cache
                    .get(context.supportGuildId)?.members?.fetch(context.userId).catch((): null => null)
                if (member) await member.roles.remove(context.roleId)
            }, {context: {supportGuildId: this.constants.supportGuildId, userId: expired.userid, roleId: prop.role}})

            await expired.remove()
            let hook = new WebhookClient({id: '774950339266740235', token: process.env.WEBHOOK_DONATE})
            await hook.send({content: `Закончилась ${expired.type === 'premium' ?
                    'премиум' : 'стандартная'} подписка для <@${expired.userid}>`})
        }
    }
}