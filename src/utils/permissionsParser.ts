import Discord from "discord.js";

export default function permissionsParser(perms: Array<Discord.PermissionString>, language: 'ru' | 'en' = 'ru'): Array<string> {
    let output: Array<string> = [];
    let translatedPerms: Record<'ru' | 'en', Record<string, string>> = {
        ru: {
            ADMINISTRATOR: 'Администратор',
            CREATE_INSTANT_INVITE: 'Создание приглашения',
            KICK_MEMBERS: 'Кикать участников',
            BAN_MEMBERS: 'Банить участников',
            MANAGE_CHANNELS: 'Управлять каналами',
            MANAGE_GUILD: 'Управлять сервером',
            ADD_REACTIONS: 'Добавлять реакции',
            VIEW_AUDIT_LOG: 'Просматривать журнал аудита',
            PRIORITY_SPEAKER: 'Приоритетный режим',
            STREAM: 'Стримить',
            VIEW_CHANNEL: 'Видеть каналы',
            SEND_MESSAGES: 'Отправлять сообщения',
            SEND_TTS_MESSAGES: 'Отправлять /tts сообщения',
            MANAGE_MESSAGES: 'Управлять сообщениями',
            EMBED_LINKS: 'Встраивать ссылки',
            ATTACH_FILES: 'Прикреплять файлы',
            READ_MESSAGE_HISTORY: 'Читать историю сообщений',
            MENTION_EVERYONE: 'Упоминать всех',
            USE_EXTERNAL_EMOJIS: 'Использовать внешние эмодзи',
            VIEW_GUILD_INSIGHTS: 'Просматривать аналитику сервера',
            CONNECT: 'Подключаться',
            SPEAK: 'Говорить',
            MUTE_MEMBERS: 'Отключать участникам микрофон',
            DEAFEN_MEMBERS: 'Отключать участникам звук',
            MOVE_MEMBERS: 'Перемещать участников',
            USE_VAD: 'Использовать режим активации по голосу',
            CHANGE_NICKNAME: 'Изменить никнейм',
            MANAGE_NICKNAMES: 'Управлять никнеймами',
            MANAGE_ROLES: 'Управлять ролями',
            MANAGE_WEBHOOKS: 'Управлять вебхуками',
            MANAGE_EMOJIS: 'Управлять эмодзи'
        },
        en: {
            ADMINISTRATOR: 'Administrator',
            CREATE_INSTANT_INVITE: 'Create invite',
            KICK_MEMBERS: 'Kick members',
            BAN_MEMBERS: 'Ban members',
            MANAGE_CHANNELS: 'Manage channels',
            MANAGE_GUILD: 'Manage server',
            ADD_REACTIONS: 'Add rections',
            VIEW_AUDIT_LOG: 'View audit log',
            PRIORITY_SPEAKER: 'Priority speaker',
            STREAM: 'Stream',
            VIEW_CHANNEL: 'View channels',
            SEND_MESSAGES: 'Send messages',
            SEND_TTS_MESSAGES: 'Send /tts messages',
            MANAGE_MESSAGES: 'Manage messages',
            EMBED_LINKS: 'Embed links',
            ATTACH_FILES: 'Attach  files',
            READ_MESSAGE_HISTORY: 'Read message history',
            MENTION_EVERYONE: 'Mention everyone',
            USE_EXTERNAL_EMOJIS: 'Use external emojis',
            VIEW_GUILD_INSIGHTS: 'View server insights',
            CONNECT: 'Connect',
            SPEAK: 'Speak',
            MUTE_MEMBERS: 'Mute members',
            DEAFEN_MEMBERS: 'Deafen members',
            MOVE_MEMBERS: 'Move members',
            USE_VAD: 'Use voice activity',
            CHANGE_NICKNAME: 'Change nickname',
            MANAGE_NICKNAMES: 'Manage nicknames',
            MANAGE_ROLES: 'Manage roles',
            MANAGE_WEBHOOKS: 'Manage webhooks',
            MANAGE_EMOJIS: 'Manage emojis'
        }
    }
    perms.forEach(perm => {
        output.push(translatedPerms[language][perm]);
    })
    return output;
}