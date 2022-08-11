import { Entity, Column } from "typeorm"
import GuildLanguage from "../GuildLanguage";
import CommandSettings from "../CommandSettings";

@Entity()
export default class Settings {
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