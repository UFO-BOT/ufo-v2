import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {WebhookClient} from "discord.js";
import fetch from "node-fetch";
import crypto from "crypto"

import Base from "@/abstractions/Base";
import SubscriptionType from "@/types/subscriptions/SubscriptionType";
import Language from "@/types/Language";
import {YookassaPayment} from "@/api/types/YookassaPayment";
import BoostManager from "@/utils/BoostManager";
import Subscription from "@/types/database/Subscription";
import SubscriptionMonthsCount from "@/types/subscriptions/SubscriptionMonthsCount";
import emojis from "@/properties/emojis.json"

@Injectable()
export class YookassaService extends Base {
    private readonly authorization = 'Basic ' + Buffer.from(process.env.YOOKASSA_SHOP_ID + ':' + process.env.YOOKASSA_TOKEN).toString('base64')

    public async createPayment(userId: string, months: SubscriptionMonthsCount, language: Language = 'en', type?: SubscriptionType, subscription_id?: string): Promise<YookassaPayment> {
        let user = await this.manager.shards.first().eval(async (client, context): Promise<{username: string} | null> => {
            let fetched = await client.users.fetch(context.userId).catch((): null => null)
            if (!fetched) return null
            return {username: fetched.username}
        }, {userId})
        if (subscription_id) {
            let subscription = await this.db.manager.findOne(Subscription, {where: {id: subscription_id}})
            if (!subscription) throw new NotFoundException("Subscription not found")
            if (type && type !== subscription.type) throw new ForbiddenException("Subscription type mismatch")
            type = subscription.type as SubscriptionType
        } else if (!type) {
            throw new ForbiddenException("Type is required when subscription_id is not provided")
        }
        let sub = this.constants.subscriptions[type]
        let period = sub.months.find(m => m.count === months)
        if (!period) throw new ForbiddenException("Subscription period not found")
        let message = sub.comment[language]
            .replace("{{username}}", user?.username ?? userId)
            .replace("{{months}}", period.name[language])
        const response = await fetch(process.env.YOOKASSA_API + '/payments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': this.authorization,

                'Idempotence-Key': crypto.randomUUID().toString(),
            },
            body: JSON.stringify({
                amount: {
                    value: period.price,
                    currency: "RUB"
                },
                capture: true,
                description: message,
                confirmation: {

                    type: "redirect",
                    return_url: process.env.WEBSITE
                },
                metadata: {
                    user_id: userId,
                    type: type,
                    months: months,
                    language: language,
                    ...(subscription_id && {subscription_id})
                }
            })
        })
        if (!response.ok) throw new InternalServerErrorException("Failed to create payment")
        return await response.json()
    }

    public async checkPayment(id: string, payment?: YookassaPayment) {
        let body: YookassaPayment
        if (process.env.YOOKASSA_WEBHOOK_TRUST_BODY === 'true' && payment) body = payment
        else {
            const response = await fetch(process.env.YOOKASSA_API + `/payments/${id}`, {
                method: 'GET',

                headers: {
                    "Content-Type": "application/json",
                    'Authorization': this.authorization,
                    'Idempotence-Key': crypto.randomUUID().toString(),
                }
            })
            body = await response.json()
            if (!response.ok || body.status !== 'succeeded')
                throw new ForbiddenException("Payment not found or is not succeeded")
        }

        if (body.status !== 'succeeded') throw new ForbiddenException("Payment not found or is not succeeded")
        let type = body.metadata?.type as SubscriptionType
        let months = Number(body.metadata?.months) as SubscriptionMonthsCount
        let userId = body.metadata?.user_id
        let subscription_id = body.metadata?.subscription_id
        if (!userId || !type || !months) throw new ForbiddenException("Payment metadata is invalid")
        let subscription = this.constants.subscriptions[type]
        let period = subscription.months.find(m => m.count === months)
        if (!period) throw new ForbiddenException("Subscription period not found")
        let amount = Number(body.amount.value)
        if (amount !== period.price) throw new ForbiddenException("Payment amount does not match subscription")
        await BoostManager.subscription(userId, type, months * 2592000000, subscription_id)
        let hook = new WebhookClient({id: '774950339266740235', token: process.env.WEBHOOK_DONATE})
        return hook.send({content: `<@${userId}> ${subscription_id ? 'продлил' : 'купил'} ${type === 'standard' ? 'стандарт' : 'премиум'} подписку на ${period.name.ru} за `
                + `${amount.toString()}₽ ${type === 'premium' ? emojis.premium_donator : emojis.donator}`})
    }
}