export interface Limit {
    standard: number
    boost: number
}

export interface Limits {
    items: Limit
    giveaways: Limit
    coupons: Limit
    customJobs: Limit
}