export interface MinPrice {
    name: string,
    prices: {
        tradable: number | null,
        nonTradable: number | null
    }
}