import ModAction from "../ModAction";
import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('cases')
export default class Case {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    number: number

    @Column()
    userid: string

    @Column()
    executor: string

    @Column()
    action: ModAction

    @Column()
    duration: number

    @Column()
    reason: string

    @Column()
    timestamp: number
}