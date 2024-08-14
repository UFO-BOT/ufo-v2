import {EmbedBuilder, Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";
import Resolver from "@/utils/Resolver";
import Appeal from "@/types/database/Appeal";
import SupportEmbed from "@/utils/SupportEmbed";

export default class AppealCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'appeal'
    public aliases = ['ap']
    public allowedUsers = ['632923863507927041', '405258156063850497']

    public async execute(message: Message, args: Array<string>) {
        let channel = message.channel as TextChannel
        let usage = 'appeal `<submit/decline/view>` `<user>`'
        let user = await Resolver.user(message.guild, args[1])
        if (!user) return message.reply({content: usage})
        let appeal = await this.db.manager.findOneBy(Appeal, {userid: user.id}) as Appeal
        if (!appeal) return message.reply({content: "Апелляция от данного пользователя не найдена"})
        switch (args[0]) {
            case "submit":
                await this.client.shard.broadcastEval((client, context) =>
                    client.guilds.cache.get(context.supportGuildId)?.members?.unban(context.userId).catch(() => null),
                    {context: {supportGuildId: this.constants.supportGuildId, userId: user.id}})
                let embedDM = SupportEmbed.appealDM()
                let dm = await user.send({embeds: [embedDM]}).catch(() => null)
                await appeal.remove()
                return message.reply({content: `Апелляция пользователя **${user.username}** `
                        + `${'(`' + user.id + '`)'} была одобнена\nСообщение в лс пользователю`
                        +` **${!dm ? 'не ' : ''}отправлено**`})
            case "decline":
                appeal.declined = true
                await appeal.save()
                return message.reply({content: `Апелляция пользователя **${user.username}** `
                        + `${'(`' + user.id + '`)'} была отклонена`})
            case "view":
                let embed = SupportEmbed.appeal(user, appeal.answers)
                return message.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
            default:
                return message.reply({content: usage})
        }
    }
}