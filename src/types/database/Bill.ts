import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";

@Entity('bills')
export default class Bill extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userid: string

    @Column()
    billId: string

    @Column()
    payUrl: string

    @Column()
    type: 'standard' | 'premium'

    @Column()
    created: number

    @Column()
    paid: boolean
}