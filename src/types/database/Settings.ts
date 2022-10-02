import {Entity, Column, ObjectIdColumn, ObjectID, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm"
import GuildLanguage from "../GuildLanguage";
import CommandSettings from "../commands/CommandSettings";

@Entity('settings')
export default class Settings extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    guildid: string

    @Column()
    prefix: string

    @Column()
    language: GuildLanguage

    @Column()
    moneysymb: string

    @Column()
    salary: {
        low: number
        high: number
    }

    @Column()
    workcooldown: number

    @Column()
    moneybags: {
        low: number
        high: number
        cooldown: number
    }

    @Column()
    commission: number

    @Column()
    logs: {
        channels: {
            messageDelete: string
            messageEdit: string
            moderation: string
        }
        ignore: {
            channels: Array<string>
        }
    }

    @Column()
    muterole: string

    @Column()
    boost: boolean

    @Column()
    boostBy: string

    @Column()
    commands: Record<string, CommandSettings>

    @Column()
    minBet: number

    @Column()
    moneybonuses: {
        daily: number
        weekly: number
    }
}