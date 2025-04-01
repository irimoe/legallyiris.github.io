<template>
	<div class="content-grid">
		<slot />
	</div>
</template>

<style scoped lang="scss">
.content-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 0.5rem;
	margin-top: 1rem;
}
</style>
