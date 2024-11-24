import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithCircuitBreaker } from "@/utils/circuitBreaker";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
        res.status(400).json({ error: "Username is required" });
        return;
    }

    try {
        const repos = await fetchWithCircuitBreaker(username);
        res.status(200).json(repos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
