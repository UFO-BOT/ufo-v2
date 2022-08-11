import {Entity, Column, ObjectIdColumn, ObjectID, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm"
import GuildLanguage from "../GuildLanguage";
import CommandSettings from "../CommandSettings";

@Entity('settings')
class Settings extends BaseEntity {
    @Column()
    guildid: string

    @Column({default: "!"})
    prefix: string

    @Column({default: {commands: 'en', interface: 'en'}})
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
    }

    @Column()
    commission: number

    @Column()
    duelCommission: boolean

    @Column()
    casenum: number

    @Column()
    muterole: number

    @Column()
    boost: boolean

    @Column()
    boostBy: string

    @Column()
    commands: Record<string, CommandSettings>
}

export default Settings;