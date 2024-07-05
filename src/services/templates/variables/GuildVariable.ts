import {Guild, GuildMember} from "discord.js";
import TimeParser from "@/utils/TimeParser";

export default class GuildVariable {
    public id: string
    public name: string
    public memberCount: string
    public iconUrl: string
    public bannerUrl: string
    public created: string

    constructor(guild: Partial<Guild>) {
        this.id = guild.id as string
        this.name = guild.name
        this.memberCount = String(guild.memberCount)
        this.iconUrl = guild.iconURL()
        this.bannerUrl = guild.bannerURL()
        this.created = TimeParser.formatTimestamp(guild.createdTimestamp, "f")
    }
}