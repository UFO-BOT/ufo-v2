import {Guild, GuildMember} from "discord.js";
import handlebars from "handlebars";
import MemberVariable from "@/services/templates/variables/MemberVariable";
import GuildVariable from "@/services/templates/variables/GuildVariable";
import MessageTemplate from "@/services/templates/messages/MessageTemplate";

export default class GreetingMessageTemplate extends MessageTemplate {
    public member: MemberVariable
    public guild: GuildVariable

    constructor(member: GuildMember, guild: Guild) {
        super()
        this.member = new MemberVariable(member)
        this.guild = new GuildVariable(guild)
    }

    public compile(template: string): string | null {
        try {
            let compiled = handlebars.compile(template, {noEscape: true})
            let str = compiled({member: this.member, guild: this.guild}).trim()
            return str.length ? str : null
        }
        catch (e) {
            return null
        }
    }
}