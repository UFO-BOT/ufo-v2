import {BaseEntity, Entity, ObjectId, ObjectIdColumn, Column} from "typeorm";

@Entity('balances')
export default class Balance extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

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
    lastCustomJobs: Record<string, number>

    @Column()
    lastmb: number

    @Column()
    lastDailyBonus: number

    @Column()
    lastWeeklyBonus: number
}