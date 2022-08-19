import 'module-alias/register'

import dotenv from 'dotenv'
dotenv.config()

import Client from "@/structures/Client";

const client = new Client(process.env.TOKEN, {
    intents: ['Guilds',
        'GuildMembers',
        'GuildBans',
        'GuildEmojisAndStickers',
        'GuildIntegrations',
        'GuildWebhooks',
        'GuildInvites',
        'GuildVoiceStates',
        'GuildPresences',
        'GuildMessages',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'GuildScheduledEvents',
        'GuildPresences',
        'MessageContent']
})

client.start()