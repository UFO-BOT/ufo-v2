export interface LeaderboardMember {
    number: number
    user: {
        id: string
        username: string
        global_name: string
        avatar: string
    }
    balance: number | 'Infinity'
    xp: number
}