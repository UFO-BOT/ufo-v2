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
        'GuildMessages',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'GuildScheduledEvents',
        'MessageContent']
})

client.start().then()