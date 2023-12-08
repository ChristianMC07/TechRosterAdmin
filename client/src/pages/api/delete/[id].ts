import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteTechnology } from "@/tools/DataManager";

export default async function handler(request: NextApiRequest, response: NextApiResponse<any>) {
    if (request.method == "DELETE") {
        await deleteTechnology(request, response);
    }
}
