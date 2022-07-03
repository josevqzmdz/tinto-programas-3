import type { RequestHandler, RequestHandlerOutput } from "@sveltejs/kit";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const get: RequestHandler = async (): Promise<RequestHandlerOutput> => {
    const orders = await prisma.order.findMany({ include: { articles: true } })
    const transformedOrders = orders.map(order => {
        return order.articles.map(article => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { articles, ...restOrder } = order
            return { ...restOrder, ...article }
        }).flat()
    }).flat()

    if (orders) return {
        body: { orders: transformedOrders }
    }

    return {
        status: 500
    }
}