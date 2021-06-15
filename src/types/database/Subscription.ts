export default interface Subscription {
    userid: string
    type: 'standard' | 'premium' | 'manager'
    boosts: number
}