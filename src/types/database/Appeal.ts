import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";

@Entity('appeals')
export default class Appeal extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userid: string

    @Column()
    answers: Array<string>

    @Column()
    declined: boolean
}