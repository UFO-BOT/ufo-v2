import {Entity, Column, ObjectIdColumn, ObjectId, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm"
import GuildLanguage from "../GuildLanguage";
import CommandSettings from "../commands/CommandSettings";

@Entity('settings')
export default class Settings extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    guildid: string

    @Column()
    prefix: string

    @Column()
    language: GuildLanguage

    @Column()
    moneysymb: string

    @Column()
    work: {
        low: number
        high: number
        cooldown: number
    }

    @Column()
    moneybags: {
        low: number
        high: number
        cooldown: number
    }

    @Column()
    commission: number

    @Column()
    duelCommission: boolean

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