import {GuildMember} from "discord.js";

export default function MemberModeratable(moderator: GuildMember, member: GuildMember): boolean {
    if(!member) return true;
    if(member.guild.ownerId === member.id) return false;
    if(moderator.guild.ownerId === moderator.id) return true;
    return moderator.roles.highest.position > member.roles.highest.position;
}