import Discord from "discord.js";

import ISettings from "@/interfaces/database/SettingsInterface";
import ICommandSettings from "@/interfaces/CommandSettings";
import CommandError from "@/utils/CommandError";
import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import ICommandFlag from "@/interfaces/CommandFlagInterface";
import {settings} from "cluster";

export default class CommandsHandler {
    public message: Discord.Message
    public args: Array<string>

    constructor(message: Discord.Message) {
        this.message = message;
    }

    public async handle(): Promise<any> {
        if (this.message.channel.type !== 'text' && this.message.channel.type !== 'news') return;

        let prefix = global.bot.cache.prefixes.get(this.message.guild.id);
        let language = global.bot.cache.languages.get(this.message.guild.id);
        let moneysymb = global.bot.cache.moneysymbs.get(this.message.guild.id);
        let commandsSettings = global.bot.cache.commandsSettings.get(this.message.guild.id);

        if (!prefix || !language || !moneysymb || !commandsSettings) {
            let settings = await global.mongo.getOne<ISettings>('settings', {guildid: this.message.guild?.id})
            prefix = settings?.prefix ?? '!'
            language = {
                commands: settings?.language?.commands ?? 'en',
                interface: settings?.language?.interface ?? 'en'
            }
            commandsSettings = settings?.commands ?? {}
            moneysymb = settings?.moneysymb ?? '<:money:705401895019348018>'
            global.bot.cache.prefixes.set(this.message.guild.id, prefix)
            global.bot.cache.languages.set(this.message.guild.id, language)
            global.bot.cache.moneysymbs.set(this.message.guild.id, moneysymb)
            global.bot.cache.commandsSettings.set(this.message.guild.id, commandsSettings)
        }

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

        let commandSettings = commandsSettings[command.en.name] ?? {} as ICommandSettings
        if (commandSettings.enabled === false) return;

        if(command.boostRequired) {
            let settings = await global.mongo.getOne<ISettings>('settings', {guildid: this.message.guild.id})
            if(!settings.boost) return CommandError.boostRequired(this.message, language.interface)
        }

        if (commandSettings.allowedRoles?.length) {
            if (!this.matchRoles(this.message.member.roles.cache, commandSettings.allowedRoles))
                return CommandError.certainRoles(this.message, language.interface)
        } else {
            if (command.memberPermissions) {
                if (!this.message.channel.permissionsFor(this.message.member).has(command.memberPermissions))
                    return CommandError.noMemberPermissions(this.message, command.memberPermissions, language.interface)
            }
        }
        if (commandSettings.forbiddenRoles?.length) {
            if (this.matchRoles(this.message.member.roles.cache, commandSettings.forbiddenRoles))
                return CommandError.certainRoles(this.message, language.interface)
        }
        if (commandSettings.allowedChannels?.length) {
            if (!commandSettings.allowedChannels.includes(this.message.channel.id))
                return CommandError.certainChannels(this.message, language.interface)
        }
        if (commandSettings.forbiddenChannels?.length) {
            if (commandSettings.forbiddenChannels.includes(this.message.channel.id))
                return CommandError.certainChannels(this.message, language.interface)
        }

        if (this.args.length < command.requiredArgs)
            return CommandError.invalidUsage(this.message, command, language)

        if (commandSettings.deleteUsage && this.message.deletable) await this.message.delete()
        
        return command.execute({
            message: this.message,
            args: this.args,
            prefix: prefix,
            language: language,
            moneysymb: moneysymb
        })
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