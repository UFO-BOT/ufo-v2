import {ForbiddenException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {WebhookClient} from "discord.js";
import {RawUserData} from "discord.js/typings/rawDataTypes";
import fetch from "node-fetch";
import crypto from "crypto"
import Base from "@/abstractions/Base";
import SubscriptionType from "@/types/SubscriptionType";
import Language from "@/types/Language";
import {YookassaPayment} from "@/api/types/YookassaPayment";
import BoostManager from "@/utils/BoostManager";
import emojis from "@/properties/emojis.json"

@Injectable()
export class YookassaService extends Base {
    private readonly authorization = 'Basic ' + Buffer.from(process.env.YOOKASSA_SHOP_ID + ':'
        + process.env.YOOKASSA_TOKEN).toString('base64')

    public async createPayment(userId: string, type: SubscriptionType, language: Language = 'en'): Promise<YookassaPayment> {
        let user = await this.manager.shards.first().eval((client, context) =>
            client.users.fetch(context.userId).catch(() => null),{userId}) as RawUserData
        let subscription = this.constants.subscriptions[type]
        let message = subscription.message[language].replace("{{username}}", user?.username)
        const response = await fetch(process.env.YOOKASSA_API + '/payments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': this.authorization,
                'Idempotence-Key': crypto.randomUUID().toString(),
            },
            body: JSON.stringify({
                amount: {
                    value: subscription.price,
                    currency: "RUB"
                },
                capture: true,
                description: message,
                confirmation: {
                    type: "redirect",
                    return_url: process.env.WEBSITE
                },
                metadata: {
                    user_id: userId
                }
            })
        })
        if (!response.ok) throw new InternalServerErrorException("Failed to create payment")
        return response.json()
    }

    public async checkPayment(id: string) {
        const response = await fetch(process.env.YOOKASSA_API + `/payments/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': this.authorization,
                'Idempotence-Key': crypto.randomUUID().toString(),
            }
        })
        let body: YookassaPayment = await response.json()
        if (!response.ok || body.status !== 'succeeded')
            throw new ForbiddenException("Payment not found or is not succeeded")
        let amount = Number(body.amount.value)
        let hook = new WebhookClient({id: '774950339266740235', token: process.env.WEBHOOK_DONATE})
        if (amount === this.constants.subscriptions.standard.price) {
            await BoostManager.subscription(body.metadata.user_id, 'standard')
            return hook.send({content: `<@${body.metadata.user_id}> купил стандартную подписку за `
                    + `${amount.toString()}₽ ${emojis.donator}`})
        }
        else if (amount === this.constants.subscriptions.premium.price)
        {
            await BoostManager.subscription(body.metadata.user_id, 'premium')
            return hook.send({content: `<@${body.metadata.user_id}> купил премиум подписку за `
                    + `${amount.toString()}₽ ${emojis.premium_donator}`})
        }
        else throw new ForbiddenException("Payment amount does not match subscription")
    }
}