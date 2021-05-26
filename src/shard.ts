import 'module-alias/register'

import dotenv from 'dotenv'
dotenv.config()

import Client from "@/structures/Client";

const bot = new Client(process.env.TOKEN, {
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
    messageCacheLifetime: 10800,
    messageSweepInterval: 300
})

bot.start()