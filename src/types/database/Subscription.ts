import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";
import SubscriptionType from "@/types/SubscriptionType";

@Entity('subscriptions')
export default class Subscription extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userid: string

    @Column()
    type: SubscriptionType

    @Column()
    boosts: number

    @Column()
    ends: Date
}