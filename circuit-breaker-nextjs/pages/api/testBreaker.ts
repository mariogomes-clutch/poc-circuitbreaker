import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithCircuitBreaker } from "@/utils/circuitBreaker";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const endpoint = req.query.endpoint as string;

    if (!endpoint) {
        res.status(400).json({ error: "Endpoint is required as a query parameter." });
        return;
    }

    try {
        const data = await fetchWithCircuitBreaker(endpoint);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Circuit breaker triggered or API failed." });
    }
}
