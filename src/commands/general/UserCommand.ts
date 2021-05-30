import Discord from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "@/abstractions/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

import replies from '@/properties/replies.json'
import Resolver from "@/utils/Resolver";

export default class UserCommand extends AbstractCommand implements ICommand {
    public ru = {
        name: 'юзер',
        aliases: ['юзер-инфо', 'пользователь'],
        category: 'Основное',
        description: 'Показывает информацию об указанном пользователе или пользователе, который вызвал эту команду',
        usage: 'юзер [пользователь]'
    }
    public en = {
        name: 'user',
        aliases: ['user-info', 'userinfo'],
        category: 'General',
        description: 'Shows information about specified user or user who used this command',
        usage: 'user [user]'
    }

    public async execute(cmd: ICommandMessage): Promise<any> {
        const reply:any = replies.user[cmd.language.interface];

        const badgesEmojis: Record<string, string> = {
            HOUSE_BALANCE: '<:balance:716398513860378664>',
            HOUSE_BRAVERY: '<:bravery:716398817787772967>',
            HOUSE_BRILLIANCE: '<:brilliance:716399292604219404>',
            DISCORD_EMPLOYEE: '<:employee:716400172128534699>',
            DISCORD_PARTNER: '<:partner:716400421039505508>',
            HYPESQUAD_EVENTS: '<:hypesquad:716400759180099634>',
            BUGHUNTER_LEVEL_1: '<:bughunter:716403021331824670>',
            BUGHUNTER_LEVEL_2: '<:goldbughunter:716403516121284668>',
            EARLY_SUPPORTER: '<:earlysupporter:716404352033751050>',
            VERIFIED_DEVELOPER: '<:verified_bot_developer:716407597292453939>'
        }

        const botBadgesEmojis: Record<string, string> = {
            '712025786399588395': 'developer',
            '712027576817942669': 'moderator',
            '712027136768081942': 'support',
            '712970942074191902': 'tester',
            '774319126822387732': 'premium_donator',
            '774318848279052299': 'donator',
            '739068301749256212': 'bughunter'
        }

        let user = await Resolver.user(cmd.message, cmd.args[0])
        if(!user) user = cmd.message.author;
        let botbadges: string = '';
        let memb = await cmd.message.guild.members.fetch(user.id).catch(() => undefined);
        let supportServerRoles: Array<Discord.Role> | undefined = await global.bot.oneShardEval(`this.guilds.cache.get(this.supportGuildID)?.members
        ?.fetch('${user.id}').then(m => m?.roles?.cache).catch(() => undefined)`)
        supportServerRoles?.forEach(role => {
            if(global.bot.cache.emojis[botBadgesEmojis[role.id]])
                botbadges += global.bot.cache.emojis[botBadgesEmojis[role.id]] + ' '
        })
        let color = '#3882f8';
        if(memb && memb?.displayHexColor !== '#000000') color = memb?.displayHexColor;
        let badges: Array<string> = [];
        let flags = await user.fetchFlags();
        flags.toArray().forEach(flag => {
            if(badgesEmojis[flag]) badges.push(badgesEmojis[flag])
        })
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(user.tag, user.avatarURL({dynamic: true}))
            .addField(reply.embed.user, `${user} ${botbadges}`)
        if(user.presence?.status) embed.addField(reply.embed.status, `${global.bot.cache.emojis[user.presence.status]} ${reply.statuses[user.presence.status]}`)
        if(badges.length > 0) embed.addField(reply.embed.badges, badges.join(" "));
        if(memb) embed.addField(reply.embed.joinedServer, moment(memb.joinedTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`') + ' (GMT+0000)')
        embed.addField(reply.embed.joinedDiscord, moment(user.createdTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`') + ' (GMT+0000)')
        if(memb && memb?.roles.highest.id !== cmd.message.guild.id) embed.addField(reply.embed.highestRole, memb.roles.highest)
        embed
            .setThumbnail(user.avatar ? user.avatarURL({dynamic: true}) : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator)%5}.png?width=230&height=230`)
            .setFooter(`ID: ${user.id}`);
        return cmd.message.channel.send(embed);
    }
}