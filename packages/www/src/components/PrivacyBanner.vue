<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'

const bannerVisible = ref(false)
const storageKey = 'privacyBannerDismissed'
const dismissButton = ref<HTMLButtonElement | null>(null)

onMounted(async () => {
	if (localStorage.getItem(storageKey) !== 'true') {
		bannerVisible.value = true
		await nextTick()
		dismissButton.value?.focus()
	}
})

const dismissBanner = () => {
	localStorage.setItem(storageKey, 'true')
	bannerVisible.value = false
}
</script>

<template>
	<Transition name="banner-slide">
		<div v-if="bannerVisible" class="privacy-banner" role="region" aria-label="Privacy Notice">
			<p>
				this site uses simple, privacy-respecting analytics (no cookies or third-party trackers).
				learn more on the
				<RouterLink to="/analytics">analytics page</RouterLink>.
			</p>
			<button ref="dismissButton" @click="dismissBanner" aria-label="dismiss privacy notice">
				got it!
			</button>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.privacy-banner {
	position: fixed;
	bottom: 2rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 2rem);
	max-width: 600px;
	background: hsla(var(--base) / 0.85);
	color: hsla(var(--text) / 1);
	padding: 0.75rem 1.25rem;
	border-radius: 0.75rem;
	box-shadow: 0 6px 16px hsla(var(--crust) / 0.25);
	border: 1px solid hsla(var(--overlay0) / 0.4);
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1.25rem;
	z-index: 1000;
	backdrop-filter: blur(8px);

	p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: hsla(var(--subtext0) / 0.95);

		a {
			color: hsla(var(--blue) / 0.95);
			text-decoration: underline;
			border-radius: 3px;
			outline-offset: 2px;
			transition: $transition;

			&:hover {
				color: hsla(var(--blue) / 1);
				text-decoration: none;
			}

			&:focus-visible {
				outline: 2px solid hsla(var(--blue) / 0.8);
				text-decoration: none;
			}
		}
	}

	button {
		flex-shrink: 0;
		padding: 0.3rem 0.85rem;
		font-size: 0.8rem;
		border-radius: 0.375rem;
		background: hsla(var(--surface0) / 0.7);
		color: hsl(var(--green));
		border: 1px solid hsla(var(--green) / 0.4);
		cursor: pointer;
		transition: all 0.2s ease;
		outline-offset: 2px;
		font-weight: 500;

		&:hover {
			background: hsla(var(--surface1) / 0.8);
			border-color: hsla(var(--green) / 0.6);
			transform: translateY(-1px);
		}

		&:focus-visible {
			outline: 2px solid hsla(var(--green) / 0.8);
			background: hsla(var(--surface1) / 0.8);
		}

		&:active {
			background: hsla(var(--surface2) / 0.9);
			transform: scale(0.98);
		}
	}
}
</style>
