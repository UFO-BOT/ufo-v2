import {Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";

@Entity('boosts')
export default class Boost {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userid: string

    @Column()
    count: number

    @Column()
    used: number
}