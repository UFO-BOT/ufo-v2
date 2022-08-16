import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('gulags')
export default class Gulag {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    userid: string

    @Column()
    reason: string
}