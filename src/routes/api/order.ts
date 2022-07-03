import type { RequestHandler, RequestHandlerOutput } from "@sveltejs/kit";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const post: RequestHandler = async ({ request }): Promise<RequestHandlerOutput> => {
    // const {
    //     articles,
    //     address,
    //     date,
    //     delivery,
    //     name,
    //     notes,
    //     phone,
    //     total,
    //     order_number
    // } = await request.json()
    const order = await request.json()

    try {
        await prisma.order.create({
            data: { ...order, articles: { create: order.articles } }
        })
        return {
            status: 202
        }

    } catch (e) {
        return {
            status: 500,
            body: `${e}`
        }
    }

}