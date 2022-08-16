import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('subscriptions')
export default class Subscription {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    userid: string

    @Column()
    type: 'standard' | 'premium' | 'manager'

    @Column()
    boosts: number
}