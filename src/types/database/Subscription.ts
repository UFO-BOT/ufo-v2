import {Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('subscriptions')
export default class Subscription {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userid: string

    @Column()
    type: 'standard' | 'premium' | 'manager'

    @Column()
    boosts: number
}