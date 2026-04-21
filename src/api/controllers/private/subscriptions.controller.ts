import {Controller, Get, Param, Req, UseGuards} from "@nestjs/common";
import {Throttle} from "@nestjs/throttler";

import Base from "@/abstractions/Base";
import {AuthGuard} from "@/api/guards/auth.guard";
import {AuthorizedRequest} from "@/api/types/AuthorizedRequest";
import Subscription from "@/types/database/Subscription";
import SubscriptionType from "@/types/subscriptions/SubscriptionType";

@Controller('subscriptions')
@Throttle(15, 60)
@UseGuards(AuthGuard)
export class SubscriptionsController extends Base {

    @Get()
    async getAll(@Req() request: AuthorizedRequest) {
        let subscriptions = await this.db.mongoManager.find(Subscription, {
            where: {userid: request.user, type: {$ne: 'manager'}}
        }) as Array<Subscription>
        return {
            subscriptions: subscriptions.map(sub => ({
                id: sub.id,
                type: sub.type,
                ends: sub.ends
            }))
        }
    }

    @Get(':id')
    async execute(@Req() request: AuthorizedRequest, @Param('id') id: string) {
        let subscription = await this.db.mongoManager.findOne(Subscription, {where: {id}}) as Subscription
        if (!subscription || subscription.userid !== request.user || subscription.type === 'manager')
            return {subscription: null}
        let type = subscription.type as SubscriptionType
        return {
            subscription: {
                id: subscription.id,
                type: type,
                ends: subscription.ends
            }
        }
    }
}
