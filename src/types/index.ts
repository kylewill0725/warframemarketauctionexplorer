interface Riven {
    weapon_url_name: string
    name: string
    attributes: {
        url_name: string
        value: number
        positive: boolean
    }[]
    polarity: string
    mod_rank: number
    mastery_level: number
    re_rolls: number
}

export interface Auction {
    id: string
    note: string
    item: Riven
    minimal_reputation: number
    starting_price: number
    buyout_price: number
    is_direct_sell: boolean
    updated: Date
    top_bid: number
    closed: boolean
    winner: string
}