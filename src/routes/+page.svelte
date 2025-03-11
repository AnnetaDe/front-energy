<script lang="ts">
	import { _getRange } from '$lib/api_operations';
	import ButtonPagination from '$lib/ButtonPagination.svelte';
	import DateForm from '$lib/DateForm.svelte';
	import { Spinner } from 'flowbite-svelte';
	import { convertToDate } from '$lib/convertToDate';

	console.log('convertToDate:', convertToDate(1234567890));

	let start_date = '2021-01-01';
	let end_date = start_date;
	let start_hour = '00:00:00';
	let end_hour = '23:59:00';

	/**@type {{ date: string, heures: string, consommation: number }[]}*/
	let displayData: { date: string; heures: string; consommation: number }[] = [];
	let loading = false;
	let noDataMessage = false;
	let per_page = 6;
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
			if (result && result.rangeData) {
				displayData = result.rangeData.items || [];
				if (displayData.length === 0) {
					noDataMessage = true;
				} else {
					noDataMessage = false;
					total_pages = result.rangeData.total / result.rangeData.limit;
					offset = result.rangeData.offset;
					page = Math.ceil(offset / per_page) + 1;
				}
			}
		} catch (error) {
			throw new Error("Couldn't fetch data");
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

<div class=" container mx-auto p-4">
	<h1 class="mb-2">📊 Energy Data</h1>
	<div class="mb-2">
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
		<Spinner />
	{:else if noDataMessage}
		<p>No data available for the selected range.</p>
	{:else if noDataMessage === false && displayData.length > 0}
		<div class="mb-2">
			<h2 class="mb-2">Results</h2>
			<div class="mb-2 flex-col justify-between rounded-lg bg-gray-300 p-2 text-xs sm:max-w-md">
				<p>Page number: {page}</p>
				<p>Per Page: {per_page}</p>
				<p>Total Pages: {total_pages}</p>
				<p>Page: {page}</p>
			</div>
			<div class="mb-2 bg-gray-300 p-2 sm:max-w-md">
				<div class="flex justify-between bg-gray-300 p-1 text-xs sm:text-sm">
					<p class="text-xs sm:text-sm">Date</p>
					<p class="text-xs sm:text-sm">Consommation</p>
				</div>
				<ul
					class="custom-scrollbar flex max-h-78 flex-col gap-1 overflow-y-auto bg-gray-300 sm:max-w-md sm:gap-1"
				>
					{#each displayData as entry}
						<li class=" flex justify-between bg-gray-100 p-1 text-xs sm:text-sm">
							<span class="text-md bg-gray-200 p-1">{convertToDate(Number(entry.date))}</span>

							<span class="text-md bg-gray-200 p-1">{entry.consommation}</span>
						</li>
					{/each}
				</ul>
			</div>
			<div class="mb-2">
				{#if !(total_pages <= 1 || page === 1)}
					<ButtonPagination text="Previous Page" onClick={prevPage} />
				{/if}
				{#if !(total_pages <= 1 || page === total_pages)}
					<ButtonPagination text="Next Page" onClick={nextPage} />
				{/if}
			</div>
		</div>
	{/if}
</div>
