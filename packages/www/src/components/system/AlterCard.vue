<script setup lang="ts">
import type { Alter } from '@/stores/fronting'

interface Props {
	alter: Alter
	isSelectable?: boolean
	isSelected?: boolean
	showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	isSelectable: false,
	isSelected: false,
	showDetails: true,
})

const emit = defineEmits<{
	select: [id: string]
}>()

function handleSelect() {
	if (props.isSelectable) {
		emit('select', props.alter.id)
	}
}
</script>

<template>
	<div
		class="alter-card"
		:class="{
			selectable: isSelectable,
			selected: isSelected,
		}"
		@click="handleSelect"
	>
		<div class="avatar">
			<img :src="alter.avatar_url || '/me.webp'" :alt="`${alter.name}'s avatar`" />
		</div>
		<div class="info">
			<h3>{{ alter.name }}</h3>
			<div v-if="showDetails" class="stuff">
				<span class="stuff-pronouns">
					{{ alter.pronouns }}
				</span>
				<span class="stuff-role">
					{{ alter.role }}
				</span>
			</div>
			<p v-if="showDetails && alter.description">{{ alter.description }}</p>
		</div>
		<div v-if="isSelectable" class="selection-indicator">
			<svg
				v-if="isSelected"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.alter-card {
	display: flex;
	gap: 1rem;
	flex: 1;
	background: hsla(var(--surface0) / 0.5);
	border: 1px solid hsla(var(--overlay0) / 0.5);
	border-radius: 0.5rem;
	padding: 0.75rem 1rem;
	transition: $transition;

	&.selectable {
		cursor: pointer;

		&:hover {
			background: hsla(var(--surface0) / 0.8);
			transform: translateY(-2px);
		}
	}

	&.selected {
		background: hsla(var(--blue) / 0.1);
		border-color: hsla(var(--blue) / 0.5);
	}

	&:not(.selectable) {
		&:hover {
			background: hsla(var(--surface0) / 0.8);
			transform: translateY(-2px);
			box-shadow: 0 4px 8px hsla(var(--crust) / 0.1);
		}
	}

	.avatar {
		flex-shrink: 0;

		img {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			object-fit: cover;
			border: 2px solid hsla(var(--overlay0) / 0.5);
		}
	}

	.info {
		flex: 1;

		h3 {
			margin: 0;
			font-size: 1.1rem;
			color: hsl(var(--text));
		}

		.stuff {
			color: hsla(var(--subtext0) / 0.9);
			font-size: 0.8rem;
			margin-bottom: 0.2rem;

			display: flex;
			flex-wrap: wrap;
			align-items: center;
			user-select: none;

			span {
				font-weight: 900;
				margin-right: 0.25rem;
			}
		}

		p {
			margin: 0;
			font-size: 0.9rem;
			color: hsla(var(--subtext2) / 1);
		}
	}

	.selection-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		color: hsl(var(--blue));
		width: 1.5rem;

		svg {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
}
</style>
