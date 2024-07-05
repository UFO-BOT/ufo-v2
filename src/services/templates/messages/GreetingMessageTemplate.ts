import {Guild, GuildMember} from "discord.js";
import handlebars from "handlebars";
import AbstractService from "@/abstractions/AbstractService";
import MemberVariable from "@/services/templates/variables/MemberVariable";
import GuildVariable from "@/services/templates/variables/GuildVariable";

export default class GreetingMessageTemplate extends AbstractService {
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
            return compiled({member: this.member, guild: this.guild})
        }
        catch (e) {
            return null
        }
    }
}