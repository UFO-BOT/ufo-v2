import {Entity, Column, ObjectIdColumn, ObjectId, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm"
import GuildLanguage from "../GuildLanguage";
import CommandSettings from "../commands/CommandSettings";
import {GuildLog} from "@/types/GuildLog";
import GuildWarnsPunishment from "@/types/GuildWarnsPunishment";
import GuildAutoMod from "@/types/automod/GuildAutoMod";
import GuildGreetings from "@/types/greetings/GuildGreetings";
import PunishmentMessage from "@/types/PunishmentMessage";

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
        min: number
        max: number
        cooldown: number
    }

    @Column()
    moneybags: {
        min: number
        max: number
        cooldown: number
    }

    @Column()
    commission: number

    @Column()
    logs: {
        list: GuildLog
        ignore: {
            channels: Array<string>
        }
    }

    @Column()
    muterole: string

    @Column()
    useTimeout: boolean

    @Column()
    warnsPunishments: Array<GuildWarnsPunishment>

    @Column()
    autoModeration: GuildAutoMod

    @Column()
    greetings: GuildGreetings

    @Column()
    boost: boolean

    @Column()
    boostBy: string

    @Column()
    commands: Record<string, CommandSettings>

    @Column()
    minBet: number

    @Column()
    messageXp: {
        chance: number
        min: number
        max: number
    }

    @Column()
    moneyBonuses: {
        daily: number
        weekly: number
    }

    @Column()
    punishmentMessages: {
        kick: PunishmentMessage
        ban: PunishmentMessage
    }
}