export type GuildLogType = 'messageDelete' | 'messageEdit' | 'messageDeleteBulk' | 'roleCreate' | 'roleEdit' | 'roleDelete' |
    'moderationWarn' | 'moderationMute' | 'moderationKick' | 'moderationBan' | 'moderationUnmute' | 'moderationUnban'

export interface GuildLogSettings {
    enabled: boolean
    channel: string | null
}

export type GuildLog = Record<GuildLogType, GuildLogSettings>