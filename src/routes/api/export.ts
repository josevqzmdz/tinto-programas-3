import type { RequestHandler, RequestHandlerOutput } from '@sveltejs/kit'
import { Parser } from 'json2csv'

import { PrismaClient } from '@prisma/client'
import { Article } from '../../types'
const prisma = new PrismaClient()

// TODO use this to export as XSLX https://www.npmjs.com/package/json-as-xlsx
export const get: RequestHandler = async (): Promise<RequestHandlerOutput> => {
    const orders = await prisma.order.findMany({
        include: {
            articles: true
        }
    })


    // se cambio un poco de la estructura de aqui
    // si hay problemas lo mas probable sea esta chingadera
    const transform = orders.map((order: { [x: string]: any; articles: any }) => {
        return order.articles.map((article: Article) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { articles, ...restOrder } = order
            return { ...restOrder, ...article }
        }).flat()
    }).flat()


    if (orders.length === 0) return {
        status: 200,
        body: 'DB is empty'
    }

    const fields = Object.keys(transform[0])
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transform);


    return {
        status: 200, headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': "attachment;filename=data.csv"
        },
        body: csv
    }
}