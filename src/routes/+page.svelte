<script lang="ts">
	import { _getRange } from '$lib/api_operations';
	import ButtonPagination from '$lib/ButtonPagination.svelte';
	import DateForm from '$lib/DateForm.svelte';
	import CustomDatePicker from '$lib/CustomDatePicker.svelte';

	let start_date = '2021-01-01';
	let end_date = start_date;
	let start_hour = '00:00:00';
	let end_hour = '23:59:00';

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
	 * @param {{ start_date: string, end_date: string, start_hour: string, end_hour: string, limit?: number, offset?: number }}
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

	function nextPage() {
		offset = offset + per_page;
		params = { ...params };
		fetchData({ ...params, offset });
	}

	function prevPage() {
		if (offset <= 0) return;
		offset = offset - per_page;
		fetchData({ ...params, offset });
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-2">📊 Energy Data</h1>
	<div class="container mx-auto p-4">
		<h2 class="mb-2">Choose range</h2>
		<DateForm
			{start_date}
			{end_date}
			{start_hour}
			{end_hour}
			onSubmit={(data) => fetchData({ ...data, limit: per_page, offset: 0 })}
		/>
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

		{#if !(total_pages <= 1 || page === total_pages)}
			<ButtonPagination text="Next Page" onClick={nextPage} />
		{/if}

		{#if !(total_pages <= 1 || page === 1)}
			<ButtonPagination text="Previous Page" onClick={prevPage} />
		{/if}
	{/if}
</div>
