import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('tempbans')
export default class Tempban {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    userid: string

    @Column()
    casenum: number

    @Column()
    started: number

    @Column()
    duration: number
}