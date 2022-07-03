<script lang="ts">
	import type { Article, Order } from '../types';
	export let orders: (Partial<Order> & Article)[];
</script>

<div class="flex flex-col mx-auto">
	{#if orders.length === 0}
		No hay ordenes
	{:else}
		<table>
			<thead>
				<tr>
					{#each Object.keys(orders[0]) as key}
						<th>{key}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each orders as order}
					<tr>
						{#each Object.values(order) as value}
							<td>{value}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style lang="postcss">
	table {
		@apply text-center;
	}

	td,
	th {
		@apply border border-gray-500;
	}

	th {
		@apply bg-gray-200;
	}
</style>
