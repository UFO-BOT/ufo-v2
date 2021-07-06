import Discord from "discord.js";

import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/CommandSettings";
import CommandError from "@/utils/CommandError";
import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import ICommandFlag from "@/types/CommandFlag";

export default class CommandsHandler {
    public message: Discord.Message
    public args: Array<string>

    constructor(message: Discord.Message) {
        this.message = message;
    }

    public async handle(): Promise<any> {
        if (this.message.channel.type !== 'text' && this.message.channel.type !== 'news') return;

        let settings = global.bot.cache.settings.get(this.message.guild.id)
        if (!settings) {
            let guildSettings = await global.mongo.findOne<Settings>('settings', {guildid: this.message.guild?.id})

            settings = {
                prefix: guildSettings?.prefix ?? '!',
                language: {
                    commands: guildSettings?.language?.commands ?? 'en',
                    interface: guildSettings?.language?.interface ?? 'en'
                },
                color: {
                    system: guildSettings?.color?.system ?? '#00a6ff',
                    success: guildSettings?.color?.success ?? '#00ff66',
                    error: guildSettings?.color?.error ?? '#ff0026'
                },
                boost: guildSettings.boost,
                moneysymb: guildSettings?.moneysymb ?? '<:money:705401895019348018>',
                commandsSettings: guildSettings?.commands ?? {} as Record<string, CommandSettings>
            }
            global.bot.cache.settings.set(this.message.guild.id, settings)
        }
        let {prefix, language, color, boost, moneysymb, commandsSettings} = settings;

        let messageArray = this.message.content.split(' ')
        while (messageArray.includes('')) {
            messageArray.splice(messageArray.indexOf(''), 1);
        }
        let cmd = messageArray[0].toLowerCase()
        if (!cmd.startsWith(prefix)) return;
        this.args = messageArray.slice(1);

        let command = global.bot.cache.commands.find(c => c[language?.commands ?? 'en'].name === cmd.slice(prefix.length))
            ?? global.bot.cache.commands.find(c => c[language?.commands ?? 'en'].aliases.includes(cmd.slice(prefix.length)))
        let devCommand = global.bot.cache.devCommands.get(cmd.slice(prefix.length))
            ?? global.bot.cache.devCommands.find(c => c.aliases.includes(cmd.slice(prefix.length)))
        if(devCommand) return this.handleDev(devCommand)
        if (!command) return

        let commandSettings = commandsSettings[command.en.name] ?? {} as CommandSettings
        if (commandSettings.enabled === false) return;

        let commandMessage = {
            message: this.message,
            args: this.args,
            prefix,
            language,
            color,
            moneysymb
        }

        if(command.boostRequired && !boost) return CommandError.boostRequired(commandMessage)

        if (commandSettings.allowedRoles?.length) {
            if (!this.matchRoles(this.message.member.roles.cache, commandSettings.allowedRoles))
                return CommandError.certainRoles(commandMessage)
        } else {
            if (command.memberPermissions) {
                if (!this.message.channel.permissionsFor(this.message.member).has(command.memberPermissions))
                    return CommandError.noMemberPermissions(commandMessage, command.memberPermissions)
            }
        }
        if (commandSettings.forbiddenRoles?.length) {
            if (this.matchRoles(this.message.member.roles.cache, commandSettings.forbiddenRoles))
                return CommandError.certainRoles(commandMessage)
        }
        if (commandSettings.allowedChannels?.length) {
            if (!commandSettings.allowedChannels.includes(this.message.channel.id))
                return CommandError.certainChannels(commandMessage)
        }
        if (commandSettings.forbiddenChannels?.length) {
            if (commandSettings.forbiddenChannels.includes(this.message.channel.id))
                return CommandError.certainChannels(commandMessage)
        }

        if (this.args.length < command.requiredArgs)
            return CommandError.invalidUsage(commandMessage, command)

        if (commandSettings.deleteUsage && this.message.deletable) await this.message.delete()
        
        return command.execute(commandMessage)
    }

    private async handleDev(command: AbstractDevCommand): Promise<any> {
        let supportServerRoles: Array<Discord.Role> = await global.bot.oneShardEval(`this.guilds.cache.get(this.supportGuildID)
            ?.members?.fetch('${this.message.author.id}').then(m => m?.roles?.cache).catch(() => [])`)
        if(!this.matchDevRoles(supportServerRoles, command.allowedRoles ?? [])) return;
        let flags = this.parseFlags(command.flags)
        return command.execute({
            message: this.message,
            args: this.args,
            flags: flags
        })
    }

    private matchRoles(memberRoles: Discord.Collection<string, Discord.Role>, roles: Array<string>): boolean {
        let has = false;
        roles.forEach(role => {
            if (memberRoles.has(role)) has = true;
        })
        return has;
    }

    private matchDevRoles(memberRoles: Array<Discord.Role>, allowedRoles: Array<string>): boolean {
        if(memberRoles.find(r => r.id === '712025786399588395')) return true;
        let has = false;
        allowedRoles.forEach(role => {
            if(memberRoles.find(r => r.id === role)) has = true;
        })
        return has;
    }

    private parseFlags(flags?: Array<ICommandFlag>): Record<string, boolean> {
        if(!flags) return {};
        let usedFlags: Record<string, boolean> = {};
        flags.forEach(flag => {
            flag.usages.forEach(usage => {
                if(this.args.includes(usage)) {
                    this.args.splice(this.args.indexOf(usage), 1)
                    usedFlags[flag.name] = true;
                }
            })
        })
        return usedFlags;
    }
}