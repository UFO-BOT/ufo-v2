import {Guild, GuildMember, TextChannel} from "discord.js";
import handlebars from "handlebars";
import AbstractService from "@/abstractions/AbstractService";
import MemberVariable from "@/services/templates/variables/MemberVariable";
import GuildVariable from "@/services/templates/variables/GuildVariable";
import ChannelVariable from "@/services/templates/variables/ChannelVariable";

export default class AutomodMessageTemplate extends AbstractService {
    public member: MemberVariable
    public guild: GuildVariable
    public channel: ChannelVariable

    constructor(member: GuildMember, guild: Guild, channel: TextChannel) {
        super()
        this.member = new MemberVariable(member)
        this.guild = new GuildVariable(guild)
        this.channel = new ChannelVariable(channel)
    }

    public compile(template: string): string | null {
        try {
            let compiled = handlebars.compile(template, {noEscape: true})
            return compiled({member: this.member, guild: this.guild, channel: this.channel})
        }
        catch (e) {
            return null
        }
    }
}