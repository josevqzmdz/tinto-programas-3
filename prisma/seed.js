import csv from 'csvtojson';
const csvFilePath = './prisma/data.csv';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// [{columnas_del_excel}] -> Cambia a que las filas vacias no esten vacias, usando el valor de la orden anterior que si exsitia
const fillEmptyArticles = async (jsonArray) => {
	const ordersUnparsed = jsonArray.filter((order) => order.article_name);
	let orders = [];

	let order_number;
	let name;
	let phone;
	let address;
	let unit_price;
	let date;
	let delivery;

	for (const order of ordersUnparsed) {
		if (order.name) {
			name = order.name;
		}

		if (order.phone) {
			phone = order.phone;
		}

		if (order.address) {
			address = order.address;
		}

		if (order.unit_price) {
			unit_price = order.unit_price;
		}

		if (order.date) {
			date = order.date;
		}

		if (order.delivery.toLowerCase() === 'si') {
			delivery = true;
		} else {
			delivery = false;
		}

		if (order.order_number) {
			order_number = order.order_number;
		}
		orders = [
			...orders,
			{ ...order, order_number, name, phone, address, unit_price, date: date, delivery }
		];
	}

	return orders;
};

// [{columnas_del_excel}] -> [{columnas_de_orden: {articles: [{columnas_del_articulo}]]}}}]
const articlesToOrder = (articles) => {
	// ['123', '2452', '35653']
	const order_numbers = Array.from(new Set(articles.map((article) => article.order_number)));

	// {'123': [{columnas_del_excel_filtradas_por_numero_de_orden}], '2452': [{columnas_del_excel_filtradas_por_numero_de_orden}] }
	const ordered_data = order_numbers.reduce((curr, number) => {
		curr[number] = articles.filter((article) => article.order_number === number);
		return curr;
	}, {});

	// {'123': [{columnas_del_articulo_que_corresponden_a_esa_orden}]}
	const filtered = order_numbers.reduce((curr, number) => {
		curr[number] = articles
			.filter((article) => article.order_number === number)
			.map((order) => {
				return {
					article_name: order.article_name,
					quantity: order.quantity ? parseInt(order.quantity) : 1,
					color: order.color,
					unit_price: order.unit_price
				};
			});
		return curr;
	}, {});


	// ['123', '252'] -> [{columnas_de_orden: {articles: [{columnas_del_articulo}]]}}}]
	const orders = order_numbers.map((order_number) => {
		return {
			order_number,
			name: ordered_data[order_number][0].name,
			phone: ordered_data[order_number][0].phone,
			address: ordered_data[order_number][0].address,
			total: ordered_data[order_number][0].total,
			notes: ordered_data[order_number][0].notes,
			date: ordered_data[order_number][0].date,
			delivery: ordered_data[order_number][0].delivery,
			articles: filtered[order_number]
		};
	});
	
	return orders;
};

const seed = async () => {
	const jsonArray = await csv().fromFile(csvFilePath);
	const articles = await fillEmptyArticles(jsonArray);
	const orders = articlesToOrder(articles);

	for (const order of orders) {
		try {
			await prisma.order.create({ data: { ...order, articles: { create: order.articles } } });
		} catch (e) {
			throw Error(e);
		}
	}
};

seed();
