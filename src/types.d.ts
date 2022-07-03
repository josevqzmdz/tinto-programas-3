// TODO use the Prisma interfaces

export interface Article {
    article_name: string;
    quantity: number;
    color: string;
    unit_price: number;
}

export interface Order {
    date: string;
    name: string;
    phone: string;
    address: string;
    delivery: boolean;
    notes: string;
    total: number;
    articles: Article[];
    order_number: number;
}