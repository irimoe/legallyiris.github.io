<script setup lang="ts">
import { computed } from 'vue'
import type { FrontingState } from '@/stores/fronting'
import AlterCard from './AlterCard.vue'

const props = defineProps<{
	frontingState: FrontingState | null
}>()

const noOneFronting = computed(() => {
	return !props.frontingState?.alters.length
})

const formattedTime = computed(() => {
	if (!props.frontingState?.timestamp) return ''
	return new Date(props.frontingState.timestamp).toLocaleString()
})

const stateDescription = computed(() => {
	if (!props.frontingState) return ''
	const { alters } = props.frontingState

	if (alters.length === 0) {
		return 'no one is currently fronting (blurry state).'
	} else if (alters.length === 1) {
		return `${alters[0].name} is the only alter fronting right now.`
	} else if (alters.length === 2) {
		return `${alters.map((a) => a.name).join(' and ')} are co-fronting right now.`
	} else {
		return `${alters.length} alters are co-fronting right now.`
	}
})
</script>

<template>
	<div class="fronting-status">
		<div v-if="noOneFronting" class="no-fronting">
			<p>no one is currently fronting (blurry state).</p>
		</div>

		<div v-else>
			<div class="fronting-display">
				<AlterCard v-for="alter in frontingState?.alters" :key="alter.id" :alter="alter" />
			</div>

			<div class="fronting-note">
				<p>{{ stateDescription }}</p>
				<time v-if="formattedTime">updated {{ formattedTime }}</time>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.fronting-status {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.fronting-display {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.no-fronting {
	background: hsla(var(--surface0) / 0.5);
	border: 1px solid hsla(var(--overlay0) / 0.5);
	border-radius: 0.5rem;
	padding: 1rem;
	margin-bottom: 0.5rem;

	p {
		margin: 0;
		font-style: italic;
		color: hsla(var(--subtext0) / 0.9);
	}
}

.fronting-note {
	margin-top: 0.75rem;
	font-size: 0.85rem;
	color: hsla(var(--subtext0) / 0.9);
	font-style: italic;

	p {
		margin: 0 0 0.25rem 0;
	}

	time {
		font-size: 0.75rem;
		opacity: 0.8;
	}
}
</style>
