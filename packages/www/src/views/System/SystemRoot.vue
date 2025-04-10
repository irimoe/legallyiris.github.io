<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFrontingStore } from '@/stores/fronting'
import { RouterLink } from 'vue-router'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FrontingStatus from '@/components/system/FrontingStatus.vue'

const frontingStore = useFrontingStore()
const refreshing = ref(false)

async function refreshFronting() {
	refreshing.value = true
	await frontingStore.fetchFrontingState()
	setTimeout(() => {
		refreshing.value = false
	}, 500)
}

onMounted(async () => {
	await frontingStore.fetchFrontingState()
})
</script>

<template>
	<h1>system</h1>
	<p>information about our system and who's currently fronting.</p>
	<hr />

	<div v-if="frontingStore.loading && !refreshing">loading system state...</div>

	<div v-else-if="frontingStore.error">
		<p>error loading system state: {{ frontingStore.error }}</p>
		<button @click="refreshFronting" class="refresh-button">try again</button>
	</div>

	<div v-else class="system-content">
		<section class="currently-fronting">
			<div class="section-header">
				<h2>currently fronting</h2>
				<button @click="refreshFronting" class="refresh-button" :class="{ refreshing }">
					<FontAwesomeIcon :icon="faSync" :class="{ spin: refreshing }" />
				</button>
			</div>

			<FrontingStatus :fronting-state="frontingStore.frontingState" />
		</section>

		<section class="about-system">
			<h2>about my system</h2>
			<p>
				i have dissociative identity disorder (DID), which means my mind is home to multiple
				identities, each with their own thoughts, feelings, and experiences.
			</p>
			<p>
				you can learn more about this on my
				<RouterLink to="/writing/my-system">detailed system explanation</RouterLink> page.
			</p>

			<div class="system-links">
				<RouterLink to="/system/switch" class="switch-link">system switch portal</RouterLink>
			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.system-content {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;

	h2 {
		margin: 0;
		font-size: 1.5rem;
	}
}

.refresh-button {
	background: none;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: hsl(var(--blue));
	padding: 0.25rem;
	border-radius: 0.25rem;
	transition: $transition;

	&:hover {
		background: hsla(var(--blue) / 0.1);
	}

	&:active {
		scale: 0.9;
	}

	svg.spin {
		animation: spin 0.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
}

.currently-fronting,
.about-system {
	background: hsla(var(--mantle) / 0.6);
	border: 1px solid hsla(var(--overlay0) / 0.25);
	border-radius: 0.75rem;
	padding: 0.5rem;
}

.system-links {
	margin-top: 1rem;

	.switch-link {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: hsla(var(--blue) / 0.1);
		color: hsl(var(--blue));
		border: 1px solid hsla(var(--blue) / 0.3);
		border-radius: 0.5rem;
		text-decoration: none;
		transition: $transition;
		font-size: 0.9rem;

		&:hover {
			background: hsla(var(--blue) / 0.2);
			transform: translateY(-1px);
		}
	}
}
</style>
