<script lang="ts">
	import { _getRange } from '$lib/api_operations';
	import ButtonPagination from '$lib/ButtonPagination.svelte';
	import CustomDatePicker from '$lib/CustomDatePicker.svelte';
	import { writable } from 'svelte/store';

	let start_date = '2021-01-01';
	let end_date = start_date;
	let start_hour = '00:00:00';
	let end_hour = '23:59:00';
	$: if (!end_date || end_date < start_date) {
		end_date = start_date;
	}

	/**@type {{ date: string, heures: string, consommation: number }[]}*/
	let displayData: { date: string; heures: string; consommation: number }[] = [];
	let loading = false;
	let noDataMessage = false;
	let per_page = 12;
	let offset: number;
	let page: number;
	let total_pages: number;
	$: params = {
		start_date: start_date,
		end_date: end_date,
		start_hour: start_hour,
		end_hour: end_hour,
		limit: per_page,
		offset: offset
	};

	/**
	 * @param {{ start_date: string, end_date: string, start_hour: string, end_hour: string, limit: number, offset: number }}
	 */
	async function fetchData(params: {
		start_date: string;
		end_date: string;
		start_hour: string;
		end_hour: string;
		limit: number;
		offset: number;
	}) {
		loading = true;
		noDataMessage = false;

		try {
			let result = await _getRange('range', params);

			console.log('result:', result);
			if (result) {
				displayData = result.rangeData.data;
				if (displayData.length === 0) {
					noDataMessage = true;
				} else {
					noDataMessage = false;
					page = result.rangeData.page;
					total_pages = result.rangeData.total_pages;
					offset = result.rangeData.offset;
				}
			}
		} catch (error) {
			console.error('oops:', error);
		} finally {
			loading = false;
		}
	}

	export function paginationNext() {
		params.offset += per_page;
		params = { ...params, start_date, end_date, start_hour, end_hour, limit: per_page };
		fetchData(params);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-2">📊 Energy Data</h1>
	<div class="container mx-auto p-4">
		<h2 class="mb-2">Choose range</h2>

		<form
			on:submit|preventDefault={() => fetchData(params)}
			class="form flex max-w-md flex-col gap-2 rounded-lg bg-gray-300 p-4"
		>
			<div class=" flex items-center gap-4">
				<label for="start_date">From</label>
				<input
					id="start_date"
					type="date"
					defaultValue={start_date}
					bind:value={start_date}
					min="2021-01-01"
					max="2022-12-31"
					required
				/>
				<label for="start_hour">Start Hour:</label>
				<input id="start_hour" type="time" bind:value={start_hour} />
			</div>

			<div class="flex items-center gap-4">
				<label for="end_date">To:</label>
				<input id="end_date" type="date" bind:value={end_date} min="2021-01-01" max="2022-12-31" />

				<label for="end_hour">End Hour:</label>
				<input id="end_hour" type="time" bind:value={end_hour} />
			</div>

			<button
				type="submit"
				class="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-900 focus:outline-none"
				>Fetch Data
			</button>
		</form>
	</div>

	{#if loading}
		<p>Loading...</p>
	{:else if noDataMessage}
		<p>No data available for the selected range.</p>
	{:else if noDataMessage === false && displayData.length > 0}
		<div class="container mx-auto p-4">
			<h2 class="mb-2">Results</h2>
			<ul class="flex max-w-md flex-col gap-2 rounded-lg bg-gray-300 p-4 text-sm">
				{#each displayData as entry}
					<li class="flex justify-between bg-gray-100 p-2">
						<span class="text-md bg-gray-200 p-2">{entry.date}</span>
						<span class="p-2">{entry.heures}</span>
						<span class="text-md bg-gray-200 p-2">{entry.consommation}</span>
					</li>
				{/each}
			</ul>
		</div>

		{#if offset > 0}
			<button
				class="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-900 focus:outline-none"
				on:click={() => {
					params.offset -= per_page;
					params = { ...params };
					fetchData(params);
				}}
			>
				previous page
			</button>
		{/if}
		{#if total_pages > 1 && page < total_pages}
			<button
				class="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-900 focus:outline-none"
				on:click={() => {
					params.offset += per_page;
					params = { ...params };
					fetchData(params);
				}}
			>
				next page
			</button>
		{/if}
	{/if}
</div>
