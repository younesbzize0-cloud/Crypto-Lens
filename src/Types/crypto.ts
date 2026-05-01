import { z } from "zod";

export const CryptoAssetSchema = z.object ({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string(),
    current_price: z.number(),
})

export type CryptoAsset = z.infer<typeof CryptoAssetSchema>;

export  interface Position {
    id: string;
    quantity: number;
    purchasePrice: number;
}