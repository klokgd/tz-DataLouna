export interface ItemInRes {
    name: string,
    prices: {
        tradable: number | null,
        nonTradable: number | null
    }
}