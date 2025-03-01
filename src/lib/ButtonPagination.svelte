<script lang="ts">
	export const paginationNext = (): void => {};
</script>

<button
	class="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-900 focus:outline-none"
	on:click={() => {
		paginationNext();
	}}
>
	next page
</button>
