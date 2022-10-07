import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('mutes')
export default class Mute extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    userid: string

    @Column()
    muterole: string

    @Column()
    casenum: number

    @Column()
    infinity: boolean

    @Column()
    timeout?: boolean

    @Column()
    ends?: Date
}