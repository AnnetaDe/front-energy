<script>
	import { _getRange } from '$lib/api_operations';
	import { onMount } from 'svelte';

	let start_date = '2022-02-01';
	let end_date = '2022-02-02';
	let start_hour = '08:00:00';
	let end_hour = '12:00:00';
	/**
	 * @type {{ date: string, heures: string, consommation: number }[]}
	 */
	let displayData = [];
	let loading = false;

	async function fetchData() {
		loading = true;
		try {
			const params = {
				start_date,
				end_date,
				start_hour: start_hour || '00:00:00',
				end_hour: end_hour || '23:59:59'
			};

			let result = await _getRange('range', params);
			displayData = result.rangeData.data;
		} catch (error) {
			console.error('Fetch Error:', error);
		} finally {
			loading = false;
		}
	}

	onMount(fetchData);
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-2">📊 Energy Data</h1>
	<div class="container mx-auto p-4">
		<h2 class="mb-2">Choose range</h2>

		<form
			on:submit|preventDefault={fetchData}
			class="form flex max-w-md flex-col gap-2 rounded-lg bg-gray-300 p-4"
		>
			<div class=" flex items-center gap-4">
				<label for="start_date">From</label>
				<input id="start_date" type="date" bind:value={start_date} required />
				<label for="start_hour">Start Hour:</label>
				<input id="start_hour" type="time" bind:value={start_hour} />
			</div>

			<div class="flex items-center gap-4">
				<label for="end_date">To:</label>
				<input id="end_date" type="date" bind:value={end_date} required />

				<label for="end_hour">End Hour:</label>
				<input id="end_hour" type="time" bind:value={end_hour} />
			</div>

			<button
				type="submit"
				class="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-900 focus:outline-none"
				>Fetch Data</button
			>
		</form>
	</div>

	{#if loading}
		<p>Loading...</p>
	{:else if displayData.length}
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
	{:else}
		<p>No data available.</p>
	{/if}
</div>
