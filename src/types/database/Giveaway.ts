import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('giveaways')
export default class Giveaway extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

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
    started: number

    @Column()
    duration: number

    @Column()
    timeout: boolean
}