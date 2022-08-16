import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity('boosts')
export default class Boost {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    userid: string

    @Column()
    count: number

    @Column()
    used: number
}