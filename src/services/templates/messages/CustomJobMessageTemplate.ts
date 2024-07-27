import {Guild, GuildMember} from "discord.js";
import handlebars from "handlebars";
import MemberVariable from "@/services/templates/variables/MemberVariable";
import GuildVariable from "@/services/templates/variables/GuildVariable";
import MessageTemplate from "@/services/templates/messages/MessageTemplate";
import WorkVariable from "@/services/templates/variables/WorkVariable";

export default class CustomJobMessageTemplate extends MessageTemplate {
    public member: MemberVariable
    public guild: GuildVariable
    public work: WorkVariable

    constructor(member: GuildMember, guild: Guild, work: WorkVariable) {
        super()
        this.member = new MemberVariable(member)
        this.guild = new GuildVariable(guild)
        this.work = work
    }

    public compile(template: string): string | null {
        try {
            let compiled = handlebars.compile(template, {noEscape: true})
            let str = compiled({member: this.member, guild: this.guild, work: this.work}).trim()
            return str.length ? str : null
        }
        catch (e) {
            return null
        }
    }
}