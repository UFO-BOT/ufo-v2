import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('coupons')
export default class Coupon extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

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