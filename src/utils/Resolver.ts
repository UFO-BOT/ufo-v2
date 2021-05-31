import Discord from "discord.js";

export default class Resolver {
    public static member(message: Discord.Message, arg: string): Promise<Discord.GuildMember> | undefined {
        return new Promise(async resolve => {
            if(!arg) return resolve(undefined)
            arg = arg.toLowerCase()
            let member;
            if(arg === '^') {
                let msg = await message.channel.messages.fetch({before: message.id, limit: 1}).catch(() => undefined);
                if(msg?.first().webhookID) return resolve(undefined)
                member = msg?.first()?.member;
                return resolve(member);
            }
            member = message.guild.members.cache.find(memb =>
                memb.id?.toLowerCase() === arg
                || memb.user?.username?.toLowerCase()?.includes(arg)
                || memb.user?.discriminator?.toLowerCase()?.includes(arg)
                || memb.user?.tag?.toLowerCase()?.includes(arg)
                || memb.user?.discriminator?.toLowerCase()?.includes(arg)
                || memb.nickname?.toLowerCase()?.includes(arg)
                || memb.user?.toString()?.toLowerCase() === arg.replace('!', ''))
            if(!member) {
                if(arg.length < 6) return resolve(undefined);
                arg = arg.replace('!', '')
                member = await message.guild.members.fetch(arg).catch(() => undefined);
                if(!member) member = await message.guild.members.fetch(arg.slice(2,arg.length-1)).catch(() => undefined)
            }
            resolve(member)
        })
    }

    public static user(message: Discord.Message, arg: string): Promise<Discord.User> | undefined {
        return new Promise(async resolve => {
            if(!arg) return resolve(undefined)
            arg = arg.toLowerCase();
            let user;
            if(arg === '^') {
                let msg = await message.channel.messages.fetch({before: message.id, limit: 1}).catch(() => undefined);
                if(msg?.first().webhookID) return resolve(undefined)
                user = msg?.first()?.author;
                return resolve(user);
            }
            user = message.guild.members.cache.find(memb =>
                memb.id?.toLowerCase() === arg
                || memb.user?.username?.toLowerCase()?.includes(arg)
                || memb.user?.discriminator?.toLowerCase()?.includes(arg)
                || memb.user?.tag?.toLowerCase()?.includes(arg)
                || memb.user?.discriminator?.toLowerCase()?.includes(arg)
                || memb.nickname?.toLowerCase()?.includes(arg)
                || memb.user?.toString()?.toLowerCase() === arg.replace('!', ''))?.user;
            if(!user) {
                if(arg.length < 6) return resolve(undefined);
                arg = arg.replace('!', '')
                user = await message.client.users.fetch(arg).catch(() => {});
                if(!user) user = await message.client.users.fetch(arg.slice(2,arg.length-1)).catch(() => undefined)
            }
            resolve(user);
        })
    }

    public static ban(message: Discord.Message, arg: string): Promise<Discord.BanOptions> | undefined {
        return new Promise(async (resolve, reject) => {
            if(!message.guild.me.hasPermission(8)) reject(new Error('Missing Permissions'));
            if(!arg) return resolve(undefined);
            arg = arg.toLowerCase();
            let bans = await message.guild.fetchBans();
            let ban;
            ban = bans?.find(b =>
                b.user?.id?.toLowerCase() === arg
                || b.user?.username?.toLowerCase()?.includes(arg)
                || b.user?.discriminator?.toLowerCase()?.includes(arg)
                || b.user?.tag?.toLowerCase()?.includes(arg)
                || b.user?.toString()?.toLowerCase() === arg.replace('!', '')
            )
            resolve(ban);
        })
    }
}