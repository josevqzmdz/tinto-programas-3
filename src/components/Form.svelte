
<script lang="ts">
	//import Table from 'src/routes/table.svelte';
//import readXlsxFile from 'read-excel-file'
import type { Order } from '../types';
import Papaparse from 'papaparse';
// https://www.npmjs.com/package/exceljs
// import  ExcelJS  from 'exceljs';
// https://stackoverflow.com/questions/19059580/client-on-node-js-uncaught-referenceerror-require-is-not-defined

	$: order.total = order.articles.reduce((prev, curr) => {
		return curr.unit_price * curr.quantity + prev;
	}, 0);

	const handleArticle = () => {
		order.articles = [...order.articles, article];

		article = {
			article_name: '',
			quantity: 0,
			color: '',
			unit_price: 0
		};
	};

	const handleOrder = async () => {
		if (order.articles.length === 0) {
			alert('Debe haber al menos 1 artículo');
			return;
		}

		const res = await fetch('/api/order', {
			method: 'POST',
			body: JSON.stringify(order),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			order = {
				articles: [],
				address: '',
				date: '',
				delivery: false,
				name: '',
				notes: '',
				phone: '',
				total: 0,
				order_number: 0
			};
		}
	};

	let order: Order = {
		articles: [],
		address: '',
		date: '',
		delivery: false,
		name: '',
		notes: '',
		phone: '',
		total: 0,
		order_number: 0
	};

	let article = {
		article_name: '',
		quantity: 0,
		color: '',
		unit_price: 0
	};

	let var_window;
			function obtenerExcel(){
				var_window = window.open("file://");
				
			}

	let fileinput: { click: () => void; }, excel;
	

	// https://stackoverflow.com/questions/43064221/typescript-ts7006-parameter-xxx-implicitly-has-an-any-type
	const onFileSelected =(e: any)=>{
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = e =>{
				// https://stackoverflow.com/questions/49431880/ts2531-object-is-possibly-null
				excel = e?.target?.result
		};
		let papa = Papaparse.parse(image, {
			header: true,
			dynamicTyping: true,
			download: true,
			complete: function (results){
				console.log(results);			
			}
		});
		console.log(papa);
	}

	/*
	function leerExcel(excel: any){
		// create workbook
		const wb = new ExcelJS.Workbook();
	
		// set workbook properties
		wb.creator = "jose miguel";

		wb.calcProperties.fullCalcOnLoad = true;

		// add worksheet
		const sheet = wb.addWorksheet(excel);

		
	}
	*/

</script>



<div class="flex flex-col space-y-8 mx-auto px-8">
	<form on:submit|preventDefault={handleArticle}>
		<label for="article">Artículo</label>
		<input bind:value={article.article_name} type="text" name="article" id="article" required />

		<label for="quantity">Cantidad</label>
		<input
			bind:value={article.quantity}
			type="number"
			min="0"
			name="quantity"
			id="quantity"
			required
		/>

		<label for="color">Color</label>
		<input bind:value={article.color} type="text" name="color" id="color" required />

		<label for="unit_price">Precio Unitario</label>
		<input
			bind:value={article.unit_price}
			type="number"
			min="0"
			name="unit_price"
			id="unit_price"
			required
		/>

		<button type="submit">Añadir artículo</button>
	</form>

	<h1 class="font-bold text-2xl ">Artículos</h1>
	<table>
		<thead class="bg-gray-300">
			<tr>
				<th>Artículo</th>
				<th>Color</th>
				<th>Cantidad</th>
				<th>Precio Unitario</th>
			</tr>
		</thead>
		<tbody>
			{#each order.articles as article}
				<tr class="text-center">
					<td>{article.article_name}</td>
					<td>{article.color}</td>
					<td>{article.quantity}</td>
					<td>{article.unit_price}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<form on:submit|preventDefault={handleOrder}>
		<label for="date"> Fecha </label>
		<input required bind:value={order.date} type="date" name="date" id="date" />

		<label for="order_number">Número de orden</label>
		<input
			required
			bind:value={order.order_number}
			type="number"
			min="0"
			name="order_number"
			id="order_number"
		/>

		<label for="name">Nombre</label>
		<input required bind:value={order.name} type="text" name="name" id="name" />

		<label for="phone">Teléfono</label>
		<input required bind:value={order.phone} type="tel" name="phone" id="phone" />

		<div>
			<label for="address">Dirección</label>
			<input
				required={order.delivery}
				bind:value={order.address}
				type="text"
				name="address"
				id="address"
				disabled={!order.delivery}
			/>

			<label for="delivery">A domicilio</label>
			<input bind:checked={order.delivery} type="checkbox" name="delivery" id="delivery" />
		</div>

		<label for="notes">Notas</label>
		<textarea required bind:value={order.notes} type="text" name="notes" id="notes" />

		<label for="total">Total</label>
		<input
			required
			bind:value={order.total}
			type="number"
			min="0"
			name="total"
			id="total"
			disabled
		/>


		<!--
			Boton para guardar exceles en base de datos
			1) https://svelte.dev/repl/b17c13d4f1bb40799ccf09e0841ddd90?version=3.49.0

		-->
		<button type="submit">Guardar orden</button>
		
		<!-- boton para subir los exceles a la db
		https://stackoverflow.com/questions/58262380/how-to-pass-parameters-to-onclick-in-svelte
		
		-->
		<!-- https://stackoverflow.com/questions/51977823/type-void-is-not-assignable-to-type-event-mouseeventhtmlinputelement-->

		<div class="btn-obtener-excel">
			<button type="button" on:click={()=>{fileinput.click();}} >Obtener Excel</button>
			<input style="display:none" type="file" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
			<!-- <input type="text" class="form-control" onclick={obtenerExcel}/> -->
		</div>
	</form>
</div>

<style lang="postcss">
	input,
	textarea {
		@apply rounded;
	}

	input:disabled {
		@apply bg-gray-200;
	}

	label {
		@apply font-semibold;
	}
	button {
		@apply bg-orange-300 font-bold font-sans rounded px-5 py-3  transition-all;
	}

	button:hover {
		@apply bg-orange-500;
	}

	button:active {
		@apply bg-orange-800;
	}

	form {
		@apply flex flex-col py-4 space-y-4;
	}
</style>
