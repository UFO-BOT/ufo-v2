export default interface Bill {
    userid: string
    billId: string
    payUrl: string
    type: 'standard' | 'premium'
    created: number
    paid: boolean
}