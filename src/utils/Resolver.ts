import {Guild, GuildBan, GuildBasedChannel, GuildMember, Role, User} from "discord.js";

export default class Resolver {
    public static async member(guild: Guild, arg: string): Promise<GuildMember> {
        arg = arg.toLowerCase();
        let member = guild.members.cache.find(m =>
            m.user?.username?.toLowerCase()?.includes(arg)
            || m.user?.discriminator?.toLowerCase()?.includes(arg)
            || m.user?.username?.toLowerCase()?.includes(arg)
            || m.user?.globalName?.toLowerCase()?.includes(arg)
            || m.nickname?.toLowerCase()?.includes(arg)
            || m.user?.toString()?.toLowerCase() === arg.replace("!", "")
        )
        if(!member) {
            if(arg.length < 6) return;
            member = await guild.members.fetch(arg).catch(() => undefined)
            if(!member) member = await guild.members.fetch(arg.slice(2,arg.length-1)).catch(() => undefined)
            if(!member) member = await guild.members.fetch(arg.slice(3,arg.length-1)).catch(() => undefined)
        }
        return member;
    }

    public static async user(guild: Guild, arg: string): Promise<User> {
        arg = arg.toLowerCase();
        let user = guild.members.cache.find(m =>
            m.user?.username?.toLowerCase()?.includes(arg)
            || m.user?.discriminator?.toLowerCase()?.includes(arg)
            || m.user?.username?.toLowerCase()?.includes(arg)
            || m.user?.globalName?.toLowerCase()?.includes(arg)
            || m.nickname?.toLowerCase()?.includes(arg)
            || m.user?.toString()?.toLowerCase() === arg.replace("!", "")
        )?.user
        if(!user) {
            if(arg.length < 6) return;
            user = await guild.client.users.fetch(arg).catch(() => undefined)
            if(!user) user = await guild.client.users.fetch(arg.slice(2,arg.length-1)).catch(() => undefined)
            if(!user) user = await guild.client.users.fetch(arg.slice(3,arg.length-1)).catch(() => undefined)
        }
        return user;
    }

    public static channel(guild: Guild, arg: string): GuildBasedChannel {
        arg = arg.toLowerCase()
        return guild.channels.cache.find(c =>
            c.id?.toLowerCase() === arg
            || c.name?.toLowerCase()?.includes(arg.replace("#", ""))
            || c.toString()?.toLowerCase() === arg
        )
    }

    public static role(guild: Guild, arg: string):Role {
        arg = arg.toLowerCase()
        return guild.roles.cache.find(r =>
            r.id?.toLowerCase() === arg
            || r.name?.toLowerCase()?.includes(arg)
            || r.toString()?.toLowerCase() === arg
        )
    }

    public static async ban(guild: Guild, arg: string): Promise<GuildBan> {
        arg = arg.toLowerCase()
        await guild.bans.fetch().catch(() => null);
        return guild.bans.cache.find(b =>
            b.user.id.toLowerCase() === arg
            || b.user.tag.toLowerCase().includes(arg)
            || b.user.toString().toLowerCase() === arg)
    }
}