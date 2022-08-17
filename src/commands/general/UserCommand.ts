import {ApplicationCommandOptionType, EmbedBuilder, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";

interface UserCommandDTO {
    user?: User
}

export default class UserCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "юзер",
            description: 'Показывает информацию об указанном пользователе или пользователе, который вызвал эту команду',
            aliases: ['юзер-инфо', 'пользователь']
        },
        en: {
            name: "user",
            description: 'Shows information about specified user or a user who used this command',
            aliases: ['user-info', 'userinfo']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            name: "user",
            config: {
                ru: {
                    name: "пользователь",
                    description: "Пользователь для получения информации"
                },
                en: {
                    name: "user",
                    description: "User to get the information"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext<UserCommandDTO>): Promise<CommandExecutionResult> {
        const badgesEmojis: Record<string, string> = {
            HypeSquadOnlineHouse1: '<:bravery:716398817787772967>',
            HypeSquadOnlineHouse2: '<:brilliance:716399292604219404>',
            HypeSquadOnlineHouse3: '<:balance:716398513860378664>',
            Staff: '<:employee:716400172128534699>',
            Partner: '<:partner:716400421039505508>',
            Hypesquad: '<:hypesquad:716400759180099634>',
            BugHunterLevel1: '<:bughunter:716403021331824670>',
            BugHunterLevel2: '<:goldbughunter:716403516121284668>',
            PremiumEarlySupporter: '<:earlysupporter:716404352033751050>',
            VerifiedDeveloper: '<:verified_bot_developer:716407597292453939>'
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

        let user = ctx.args.user;
        if(!user) user = ctx.member.user;
        let botBadges: string = '';
        let member = await ctx.guild.members.fetch(user.id).catch(() => undefined);
        let supportServerRoles: Array<Role> =
            await global.client.oneShardEval((client, c) =>
                client.guilds.cache.get(c.supportGuildID)?.members?.fetch(c.id).then(m => m.roles.cache).catch(() => undefined),
                {context: {supportGuildID: global.client.supportGuildID, id: user.id}})
        supportServerRoles?.forEach(role => {
            if(global.client.cache.emojis[botBadgesEmojis[role.id]])
                botBadges += global.client.cache.emojis[botBadgesEmojis[role.id]] + ' '
        })
        let color = process.env.SYSTEM_COLOR;
        if(member && member?.displayHexColor !== '#000000') color = member?.displayHexColor;
        let badges: Array<string> = [];
        let flags = await user.fetchFlags();
        flags.toArray().forEach(flag => {
            if(badgesEmojis[flag]) badges.push(badgesEmojis[flag])
        })
        let embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: user.tag, iconURL: user.avatarURL()})
            .addFields({name: ctx.response.data.embed.user, value: `${user} ${botBadges}`})
        if(member?.presence?.status) embed.addFields({name: ctx.response.data.embed.status,
            value: `${global.client.cache.emojis[member.presence.status]} ${ctx.response.data.statuses[member.presence.status]}`})
        if(badges.length > 0) embed.addFields({name: ctx.response.data.embed.badges, value: badges.join(" ")});
        if(member) embed.addFields({name: ctx.response.data.embed.joinedServer,
            value: moment(member.joinedTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`') + ' (GMT+0000)'})
        embed.addFields({name: ctx.response.data.embed.joinedDiscord,
            value: moment(user.createdTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`') + ' (GMT+0000)'})
        if(member && member?.roles.highest.id !== ctx.member.guild.id) embed.addFields({name: ctx.response.data.embed.highestRole,
            value: member.roles.highest.toString()})
        embed
            .setThumbnail(user.avatar ? user.avatarURL() : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator)%5}.png?width=230&height=230`)
            .setFooter({text: `ID: ${user.id}`});
        return {reply: {embeds: [embed]}}
    }
}