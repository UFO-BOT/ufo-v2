import Discord from "discord.js";

import ISettings from "@/interfaces/database/SettingsInterface";
import ICommandSettings from "@/interfaces/CommandSettings";
import CommandError from "@/utils/CommandError";

export default class CommandsHandler {
    public message: Discord.Message

    constructor(message: Discord.Message) {
        this.message = message;
    }

    async handle(): Promise<any> {
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
        let args = messageArray.slice(1)

        let command = global.bot.cache.commands.find(c => c[language?.commands ?? 'en'].name === cmd.slice(prefix.length))
        if (!command) command = global.bot.cache.commands.find(c => c[language?.interface ?? 'ru'].aliases.includes(cmd.slice(prefix.length)))
        if (!command) return

        function matchRoles(memberRoles: Discord.Collection<string, Discord.Role>, roles: Array<string>): boolean {
            let has = false;
            roles.forEach(role => {
                if (memberRoles.has(role)) has = true;
            })
            return has;
        }

        let commandSettings = commandsSettings[command.en.name] ?? {} as ICommandSettings
        if (commandSettings.enabled === false) return;

        if (commandSettings.allowedRoles?.length) {
            if (!matchRoles(this.message.member.roles.cache, commandSettings.allowedRoles))
                return CommandError.certainRoles(this.message, language.interface)
        } else {
            if (command.memberPermissions) {
                if (!this.message.channel.permissionsFor(this.message.member).has(command.memberPermissions))
                    return CommandError.noMemberPermissions(this.message, this.message.member.permissions, language.interface)
            }
        }
        if (commandSettings.forbiddenRoles?.length) {
            if (matchRoles(this.message.member.roles.cache, commandSettings.forbiddenRoles))
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

        if (commandSettings.deleteUsage && this.message.deletable) await this.message.delete()
        return command.execute({
            message: this.message,
            args: args,
            prefix: prefix,
            language: language,
            moneysymb: moneysymb
        })
    }
}