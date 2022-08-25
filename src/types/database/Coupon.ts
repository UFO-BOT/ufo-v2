import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('coupons')
export default class Coupon extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    name: string

    @Column()
    amount: number

    @Column()
    usages: number

    @Column()
    usedBy: Array<string>

    @Column()
    created: number

    @Column()
    duration: number
}