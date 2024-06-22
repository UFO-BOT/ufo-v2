import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('tempbans')
export default class Ban extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    guildid: string

    @Column()
    userid: string

    @Column()
    casenum: number

    @Column()
    timeout: boolean

    @Column()
    ends: Date
}