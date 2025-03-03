<script lang="ts">
	export let start_date = '2021-01-01';
	export let end_date = start_date;
	export let start_hour = '00:00:00';
	export let end_hour = '23:59:00';
	export let min_date = '2021-01-01';
	export let max_date = '2022-12-31';

	$: if (!end_date || end_date < start_date) {
		end_date = start_date;
	}

	/** @type {(data: { start_date: string, end_date: string, start_hour: string, end_hour: string }) => void} */
	export let onSubmit: (data: {
		start_date: string;
		end_date: string;
		start_hour: string;
		end_hour: string;
	}) => void;
</script>

<form
	on:submit|preventDefault={() => onSubmit({ start_date, end_date, start_hour, end_hour })}
	class=" form mb-4 flex max-w-sm flex-col gap-2 rounded-lg bg-gray-300 p-4 sm:max-w-md sm:gap-6"
>
	<div class="items-left flex flex-col gap-4 sm:flex-row">
		<label for="start_date">From</label>
		<input
			id="start_date"
			type="date"
			bind:value={start_date}
			min={min_date}
			max={max_date}
			required
		/>

		<label for="start_hour">Start Hour:</label>
		<input id="start_hour" type="time" bind:value={start_hour} />
	</div>

	<div class="items-left flex flex-col gap-4 sm:flex-row">
		<label for="end_date">To:</label>
		<input id="end_date" type="date" bind:value={end_date} min={min_date} max={max_date} />

		<label for="end_hour">End Hour:</label>
		<input id="end_hour" type="time" bind:value={end_hour} />
	</div>

	<button
		type="submit"
		class="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-900 focus:outline-none"
	>
		Fetch Data
	</button>
</form>
