import {GuildMember} from "discord.js";

export default class MemberVariable {
    public id: string
    public username: string
    public globalName: string
    public nickname: string
    public avatarUrl: string
    public bannerUrl: string
    public bot: boolean
    public mention: string
    public created: number
    public joined: number

    constructor(member: Partial<GuildMember>) {
        this.id = member.id as string
        this.username = member.user.username
        this.globalName = member.user.globalName
        this.nickname = member.nickname ?? member.user.globalName
        this.avatarUrl = member.displayAvatarURL()
        this.bannerUrl = member.user.bannerURL()
        this.bot = member.user.bot
        this.mention = member.user.toString()
        this.created = member.user.createdTimestamp
        this.joined = member.joinedTimestamp
    }
}