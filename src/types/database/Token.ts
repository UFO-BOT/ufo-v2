import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('tokens')
export default class Token {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    userid: string

    @Column()
    accessToken: string

    @Column()
    refreshToken: string
}