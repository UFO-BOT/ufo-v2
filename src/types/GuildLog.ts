type GuildLogType = 'messageDelete' | 'messageEdit' | 'messageDeleteBulk' | 'roleCreate' | 'roleEdit' | 'roleDelete' |
    'moderationWarn' | 'moderationMute' | 'moderationKick' | 'moderationBan' | 'moderationUnmute' | 'moderationUnban'

interface GuildLog {
    enabled: boolean
    channel: string | null
}

export {GuildLogType, GuildLog}