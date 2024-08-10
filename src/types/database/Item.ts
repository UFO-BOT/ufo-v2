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
    iconUrl?: string

    @Column()
    requiredRoles?: Array<string>

    @Column()
    requiredXp?: number

    @Column()
    price: number

    @Column()
    xp: number | {
        min: number
        max: number
    }

    @Column()
    addRole: string | null

    @Column()
    removeRole: string | null
}