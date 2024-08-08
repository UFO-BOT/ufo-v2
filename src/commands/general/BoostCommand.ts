import {ApplicationCommandOptionType, EmbedBuilder, Guild} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Balance from "@/types/database/Balance";
import Boost from "@/types/database/Boost";
import GuildSettings from "@/utils/GuildSettings";
import Settings from "@/types/database/Settings";
import {promisify} from "util";

interface BoostCommandDTO {
    action?: 'remove' | 'list'
    guildId?: string
}

export default class BoostCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "буст",
            description: 'Активирует/деактивирует UFO буст на текущем сервере или помогает управлять вашими бустами',
            aliases: ['уфобуст']
        },
        en: {
            name: "boost",
            description: 'Activates/deactivates UFO Boost on current server or helps manage your boosts',
            aliases: ['ufoboost']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "action",
            config: {
                ru: {
                    name: "действие",
                    description: "Действия с бустами",
                    choices: [
                        {name: "снять", value: "remove"},
                        {name: "список", value: "list"}
                    ]
                },
                en: {
                    name: "action",
                    description: "Actions with boosts",
                    choices: [
                        {name: "remove", value: "remove"},
                        {name: "list", value: "list"}
                    ]
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "guildId",
            config: {
                ru: {
                    name: "сервер",
                    description: "ID сервера (только для снятия буста с определенного сервера)"
                },
                en: {
                    name: "server",
                    description: "Server ID (only for removing boost from specific server)"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext<BoostCommandDTO>): Promise<CommandExecutionResult> {
        let boost = await this.db.manager.findOneBy(Boost, {userid: ctx.member.id}) as Boost
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
        ctx.response.parse({
            ufoboost: this.client.cache.emojis.ufoboost,
            guildid: ctx.guild.id as string
        })
        let settings
        switch (ctx.args.action) {
            case "list":
                let servers = await this.db.mongoManager
                    .find(Settings, {where: {boostBy: ctx.member.id}}) as Array<Settings>
                let list = ''
                for (let server of servers) {
                    let guild = await this.client.oneShardEval((client, context) =>
                        client.guilds.cache.get(context.guildId), {context: {guildId: server.guildid}}) as Guild
                    if (guild) list += `${guild.name} - `
                    list += '`' + server.guildid + '`\n'
                }
                if (list.length) embed.addFields({
                    name: ctx.response.data.list.embed.servers,
                    value: list
                })
                embed
                    .setAuthor({name: ctx.response.data.list.embed.author, iconURL: ctx.member.displayAvatarURL()})
                    .addFields([
                        {
                            name: ctx.response.data.list.embed.amount,
                            value: (boost?.count ?? 0).toLocaleString(ctx.settings.language.interface) + ' ' +
                                this.client.cache.emojis.ufoboost,
                            inline: true
                        },
                        {
                            name: ctx.response.data.list.embed.used,
                            value: (boost?.used ?? 0).toLocaleString(ctx.settings.language.interface) + ' ' +
                                this.client.cache.emojis.ufoboost,
                            inline: true
                        }
                    ])
                return {reply: {embeds: [embed], ephemeral: true}}
            case "remove":
                let guildId = ctx.args.guildId ?? ctx.guild.id
                settings = await this.db.manager.findOneBy(Settings, {guildid: guildId})
                if (!settings?.boost || settings?.boostBy !== ctx.member.id) return {
                    error: {type: "other", options: {text: ctx.response.data.errors.notActivated}}
                }
                settings.boost = false
                settings.boostBy = ''
                boost.used --
                await boost.save()
                await settings.save()
                await this.client.shard.broadcastEval((client, context) =>
                    client.emit('updateCache', context.guildId), {context: {guildId: ctx.guild.id}})
                return {reply: {embeds: [embed.setDescription(ctx.response.data.remove.embed.description)]}}
            default:
                if (!boost || boost?.used >= boost?.count)
                    return {reply: {embeds: [embed.setDescription(ctx.response.data.errors.noBoosts)]}}
                settings = await GuildSettings.findOrCreate(ctx.guild.id as string);
                if (settings.boost) return {
                    error: {type: "other", options: {text: ctx.response.data.errors.alreadyActivated}}
                }
                boost.used ++
                settings.boost = true
                settings.boostBy = ctx.member.id as string
                await boost.save()
                await settings.save()
                await this.client.shard.broadcastEval((client, context) =>
                    client.emit('updateCache', context.guildId), {context: {guildId: ctx.guild.id}})
                return {reply: {embeds: [embed.setDescription(ctx.response.data.activate.embed.description)]}}
        }
    }
}