import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";
import SubscriptionType from "@/types/subscriptions/SubscriptionType";

@Entity('subscriptions')
export default class Subscription extends BaseEntity {

    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    id: string

    @Column()
    userid: string

    @Column()
    type: SubscriptionType | 'manager'

    @Column()
    ends: Date

    @Column()
    boosts: number
}