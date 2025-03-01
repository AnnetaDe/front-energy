<script lang="ts">
	export let text = 'Click me';
	export let onClick = () => {};
	export let className = 'bg-fuchsia-700 hover:bg-fuchsia-900';
</script>

<button
	type="submit"
	on:click={onClick}
	class={`rounded-md px-4 py-2 text-white focus:outline-none ${className}`}
>
	{text}
</button>
