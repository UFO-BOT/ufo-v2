import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity('shops')
export default class Item extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    name: string

    @Column()
    description: string | null

    @Column()
    addrole: string | null

    @Column()
    removerole: string | null

    @Column()
    price: number

    @Column()
    xp: number
}