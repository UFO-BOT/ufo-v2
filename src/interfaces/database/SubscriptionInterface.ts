export default interface ISubscription {
    userid: string
    type: 'standard' | 'premium' | 'manager'
    boosts: number
}