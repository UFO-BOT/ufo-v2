import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('tokens')
export default class Token extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    userid: string

    @Column()
    accessToken: string

    @Column()
    refreshToken: string
}