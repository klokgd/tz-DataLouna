import axios from "axios";
import redisClient from "../config/redis";
import { ItemRes } from "./interfaces/ItemRes";
import { MinPrice } from "../models/minPriceModel";

export async function getMinPrices(): Promise<MinPrice[]> {
    const cacheKey = "min_prices";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }
    const url =
        process.env.SKINPORT_API_URL ?? "https://api.skinport.com/v1/items";
        
    try {
        const tradableResponse = await axios.get<ItemRes[]>(url, {
            params: {
                tradable: true,
            },
        });

        const nonTradableResponse = await axios.get<ItemRes[]>(url);

        const tradableItems = tradableResponse.data;
        const nonTradableItems = nonTradableResponse.data;

        const nonTradableMap = new Map();
        nonTradableItems.forEach((item: any) => {
            nonTradableMap.set(item.market_hash_name, item.min_price);
        });

        const minPrices = tradableItems.map((item: any) => {
            const tradablePrice = item.min_price || null;
            const nonTradablePrice =
                nonTradableMap.get(item.market_hash_name) || null;
            
            return {
                name: item.market_hash_name,
                prices: {
                    tradable: tradablePrice,
                    nonTradable: nonTradablePrice,
                },
            };
        });

        await redisClient.set(cacheKey, JSON.stringify(minPrices), {
            EX: 300,
        });

        return minPrices;
    } catch (error) {
        console.error("Error fetching data from Skinport API:", error);
        throw new Error("Failed to fetch data from Skinport API");
    }
}
