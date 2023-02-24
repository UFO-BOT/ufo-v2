export interface LeaderboardMember {
    number: number
    user: {
        id: string
        tag: string
        avatar: string
    }
    balance: number | 'Infinity'
    xp: number
}