import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('shops')
export default class Item extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    guildid: string

    @Column()
    name: string

    @Column()
    description: string | null

    @Column()
    addRole: string | null

    @Column()
    removeRole: string | null

    @Column()
    price: number

    @Column()
    xp: number
}