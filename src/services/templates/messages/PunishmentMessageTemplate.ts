import {Guild, GuildMember, TextChannel} from "discord.js";
import handlebars from "handlebars";
import MemberVariable from "@/services/templates/variables/MemberVariable";
import GuildVariable from "@/services/templates/variables/GuildVariable";
import MessageTemplate from "@/services/templates/messages/MessageTemplate";
import Language from "@/types/Language";
import PunishmentVariable from "@/services/templates/variables/PunishmentVariable";

export default class PunishmentMessageTemplate extends MessageTemplate {
    public member: MemberVariable
    public guild: GuildVariable
    public moderator: MemberVariable

    constructor(member: GuildMember, guild: Guild, moderator: GuildMember, public punishment: PunishmentVariable, language: Language) {
        super(language)
        this.member = new MemberVariable(member)
        this.guild = new GuildVariable(guild)
        this.moderator = new MemberVariable(moderator)
    }

    public compile(template: string): string | null {
        try {
            let compiled = handlebars.compile(template, {noEscape: true})
            let str = compiled({member: this.member, guild: this.guild, moderator: this.moderator,
                punishment: this.punishment}).trim()
            return str.length ? str : null
        }
        catch (e) {
            return null
        }
    }
}