<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)
const commandDialog = ref<HTMLElement | null>(null)

const openCommandPalette = (e: KeyboardEvent) => {
	const ctrlK = e.key === 'k' && (e.metaKey || e.ctrlKey)
	const altP = e.key === 'p' && e.altKey
	const forwardSlash =
		e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)

	if (ctrlK || altP || forwardSlash) {
		e.preventDefault()
		isOpen.value = true
	}
}

type Command = {
	id: string
	name: string
	description: string
	action: () => void
}

const commands = computed(() => {
	const routes = router
		.getRoutes()
		.filter((route) => route.meta.nav || route.name === 'home')
		.map((route) => ({
			id: route.name as string,
			name: route.name as string,
			description: `navigate to ${String(route.name)}`,
			action: () => router.push(route.path),
		}))

	if (!searchQuery.value) return routes

	return routes.filter(
		(command) =>
			command.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			command.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
	)
})

const handleKeyDown = (e: KeyboardEvent) => {
	if (!isOpen.value) return

	if (e.key === 'ArrowDown') {
		e.preventDefault()
		selectedIndex.value = (selectedIndex.value + 1) % commands.value.length
	} else if (e.key === 'ArrowUp') {
		e.preventDefault()
		selectedIndex.value = (selectedIndex.value - 1 + commands.value.length) % commands.value.length
	} else if (e.key === 'Enter') {
		e.preventDefault()
		if (commands.value[selectedIndex.value]) {
			commands.value[selectedIndex.value].action()
			isOpen.value = false
			searchQuery.value = ''
		}
	} else if (e.key === 'Escape') {
		e.preventDefault()
		isOpen.value = false
		searchQuery.value = ''
	} else if (e.key === 'Tab') {
		// focus trap
		e.preventDefault()
		if (e.shiftKey) {
			if (document.activeElement === searchInput.value) {
				const items = commandDialog.value?.querySelectorAll('.command-item') || []
				if (items.length > 0) {
					;(items[items.length - 1] as HTMLElement).focus()
				}
			}
		} else {
			// focus first element when tab from last element
			const items = commandDialog.value?.querySelectorAll('.command-item') || []
			if (items.length > 0 && document.activeElement === items[items.length - 1]) {
				searchInput.value?.focus()
			}
		}
	}
}

watch(searchQuery, () => {
	selectedIndex.value = 0
})

watch(isOpen, async (newIsOpen) => {
	if (newIsOpen) {
		await nextTick()
		searchInput.value?.focus()
	}
})

onMounted(() => {
	window.addEventListener('keydown', openCommandPalette)
	window.addEventListener('keydown', handleKeyDown)
})

function executeCommand(command: Command) {
	command.action()
	isOpen.value = false
	searchQuery.value = ''
}
</script>

<template>
	<div class="command-palette" :class="{ open: isOpen }">
		<div class="overlay" @click="isOpen = false" v-if="isOpen"></div>
		<div class="command-dialog" v-if="isOpen" ref="commandDialog">
			<div class="command-input">
				<FontAwesomeIcon :icon="faMagnifyingGlass" />
				<input
					ref="searchInput"
					type="text"
					v-model="searchQuery"
					placeholder="search commands..."
					@blur="
						(e) => {
							if (commandDialog?.contains(e.relatedTarget as Node)) {
								e.preventDefault()
							}
						}
					"
				/>
			</div>
			<div class="command-results">
				<div
					v-for="(command, index) in commands"
					:key="command.id"
					class="command-item"
					:class="{ active: index === selectedIndex }"
					@click="executeCommand(command)"
					tabindex="0"
					@keydown.enter="executeCommand(command)"
				>
					<div class="command-name">{{ command.name }}</div>
					<div class="command-description">{{ command.description }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.command-palette {
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: hsla(var(--crust) / 0.7);
		backdrop-filter: blur(5px);
		z-index: 1000;
	}

	.command-dialog {
		position: fixed;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		max-width: 600px;
		background: hsl(var(--base));
		border: 1px solid hsla(var(--overlay0) / 0.8);
		border-radius: 0.5rem;
		z-index: 1001;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.command-input {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid hsla(var(--overlay0) / 0.3);

		svg {
			color: hsla(var(--subtext0) / 0.8);
			margin-right: 0.5rem;
		}

		input {
			flex: 1;
			background: none;
			border: none;
			color: hsl(var(--text));
			font-size: 1rem;
			outline: none;

			&::placeholder {
				color: hsla(var(--subtext0) / 0.6);
			}
		}
	}

	.command-results {
		max-height: 60vh;
		overflow-y: auto;

		.command-item {
			padding: 0.75rem 1rem;
			cursor: pointer;
			transition: $transition;

			&.active,
			&:hover {
				background: hsla(var(--overlay0) / 0.3);
			}

			.command-name {
				font-size: 0.9rem;
				font-weight: 600;
				color: hsla(var(--text) / 0.9);
			}

			.command-description {
				font-size: 0.75rem;
				color: hsla(var(--subtext0) / 0.8);
			}
		}
	}
}
</style>
