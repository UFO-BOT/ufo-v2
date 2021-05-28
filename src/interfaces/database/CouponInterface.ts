export default interface ICoupon {
    guildid: string
    name: string
    amount: number
    usages: number
    usedBy: Array<string>
    created: number
    duration: number
}