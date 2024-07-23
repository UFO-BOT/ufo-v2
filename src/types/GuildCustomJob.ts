export default interface GuildCustomJob {
    name: string
    description: string
    message: string
    thumbnailUrl?: string
    salary: {
        min: number
        max: number
    }
    cooldown: number
    requiredXp: number
    requiredRoles: Array<string>
}