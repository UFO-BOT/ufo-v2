import {BaseEntity, Entity, ObjectID, ObjectIdColumn, Column} from "typeorm";

@Entity('balances')
export default class Balance extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    userid: string

    @Column()
    balance: number

    @Column()
    xp: number

    @Column()
    lastwork: number

    @Column()
    lastmb: number

    @Column()
    lastDailyBonus: number

    @Column()
    lastWeeklyBonus: number
}