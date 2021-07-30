import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandConfig from "@/types/CommandConfig";
import CommandMessage from "@/types/CommandMessage";

import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";

import replies from '@/properties/replies.json'
import args from '@/properties/arguments.json'
import CommandError from "@/utils/CommandError";

export default class StatsCommand extends AbstractCommand implements CommandConfig {
    public ru = {
        name: 'лидеры',
        aliases: ['таблица-лидеров', 'топ'],
        category: 'Экономика',
        description: 'Показывает топ участников по балансу или опыту',
        usage: 'лидеры [баланс | опыт] [страница]'
    }
    public en = {
        name: 'leaders',
        aliases: ['leaderboard', 'top'],
        category: 'Economy',
        description: 'Shows members balance or experience in the leaderboard',
        usage: 'leaders [balance/xp] [page]'
    }

    public async execute(cmd: CommandMessage) {
        const reply = replies.leaders[cmd.language.interface];
        const argument = args.leaders[cmd.language.commands];

    }
}