<script lang="ts">
	import { Datepicker } from 'svelte-calendar';
	import { writable } from 'svelte/store';
	import dayjs from 'dayjs';

	// Store to hold the selected date range (from, to)
	let dateRange = writable<{ from: Date | undefined; to: Date | undefined }>({
		from: undefined,
		to: undefined
	});

	// Watch dateRange to handle selection
	dateRange.subscribe((value) => {
		if (value.from !== undefined && value.to !== undefined) {
			console.log('Selected range:', value.from, value.to);
		} else {
			console.log('No complete range selected');
		}
	});

	// Format the selected date range for display
	const formattedDateRange =
		$dateRange.from && $dateRange.to
			? `${dayjs($dateRange.from).format('ddd MMM D, YYYY')} - ${dayjs($dateRange.to).format('ddd MMM D, YYYY')}`
			: 'No range selected';
</script>

<div class="mb-64 md:w-1/2">
	<!-- Datepicker for Range (Only allows selecting start and end date) -->
	<Datepicker bind:start={$dateRange.from} bind:end={$dateRange.to} />

	<!-- Display selected date range -->
	<div class="mt-4">
		<p>
			Selected range:
			{#if $dateRange.from && $dateRange.to}
				{$dateRange.from ? dayjs($dateRange.from).format('ddd MMM D, YYYY') : 'No date selected'} -
				{$dateRange.to ? dayjs($dateRange.to).format('ddd MMM D, YYYY') : 'No date selected'}
			{:else}
				None
			{/if}
		</p>
	</div>
</div>
