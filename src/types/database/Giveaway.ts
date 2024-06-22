import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('giveaways')
export default class Giveaway extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    guildid: string

    @Column()
    channel: string

    @Column()
    message: string

    @Column()
    creator: string

    @Column()
    number: number

    @Column()
    prize: number

    @Column()
    ends: Date

    @Column()
    timeout: boolean
}