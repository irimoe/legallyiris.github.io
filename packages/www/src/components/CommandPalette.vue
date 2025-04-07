<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useThemeStore, type Theme } from '@/stores/theme'

const themeStore = useThemeStore()

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

const allCommands = () => {
	const routesObject = {
		name: 'routes',
		commands: router
			.getRoutes()
			.filter((route) => route.meta.nav || route.name === 'home' || route.meta.commandPalette)
			.map((route) => ({
				id: route.name as string,
				name: route.name as string,
				description: `navigate to ${String(route.name)}`,
				action: () => router.push(route.path),
			})),
	}

	const themeObject = {
		name: 'themes',
		commands: ['latte', 'frappe', 'macchiato', 'mocha'].map((theme) => ({
			id: `theme-${theme}`,
			name: `theme: ${theme}`,
			description: `switch to ${theme} (${theme === 'latte' ? 'light' : 'dark'})`,
			action: () => themeStore.setTheme(theme as Theme),
		})),
	}

	const socialObject = {
		name: 'social',
		commands: [
			{
				id: 'github',
				name: 'github',
				description: 'open github profile',
				action: () => window.open('https://github.com/legallyiris', '_blank'),
			},
			{
				id: 'bluesky',
				name: 'bluesky',
				description: 'open bluesky profile',
				action: () => window.open('https://bsky.app/profile/legallyiris.dev', '_blank'),
			},
		],
	}

	const utilityObject = {
		name: 'utility',
		commands: [
			{
				id: 'share',
				name: 'share page',
				description: 'copy current url to clipboard',
				action: () => {
					navigator.clipboard.writeText(window.location.href)
				},
			},
		],
	}

	return {
		routes: routesObject,
		theme: themeObject,
		social: socialObject,
		utility: utilityObject,
	}
}

const commands = computed(() => {
	const all = allCommands()
	if (!searchQuery.value) return all

	const filtered = Object.entries(all).reduce(
		(acc, [key, category]) => {
			const filteredCommands = category.commands.filter(
				(cmd) =>
					cmd.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
					cmd.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
			)

			if (filteredCommands.length > 0) {
				acc[key] = {
					name: category.name,
					commands: filteredCommands,
				}
			}

			return acc
		},
		{} as Record<string, { name: string; commands: Command[] }>,
	)

	return filtered
})

const flattenedCommands = computed(() => {
	return Object.values(commands.value).flatMap((category) => category.commands)
})
const selectedCommand = ref<Command | null>(flattenedCommands.value[0])

const handleKeyDown = (e: KeyboardEvent) => {
	if (!isOpen.value) return

	if (e.key === 'ArrowDown') {
		e.preventDefault()
		selectedIndex.value = (selectedIndex.value + 1) % flattenedCommands.value.length
		selectedCommand.value = flattenedCommands.value[selectedIndex.value]
	} else if (e.key === 'ArrowUp') {
		e.preventDefault()
		selectedIndex.value =
			(selectedIndex.value - 1 + flattenedCommands.value.length) % flattenedCommands.value.length
		selectedCommand.value = flattenedCommands.value[selectedIndex.value]
	} else if (e.key === 'Enter') {
		e.preventDefault()
		if (flattenedCommands.value[selectedIndex.value]) {
			flattenedCommands.value[selectedIndex.value].action()
			isOpen.value = false
			searchQuery.value = ''
			selectedCommand.value = null
			selectedIndex.value = 0
		}
	} else if (e.key === 'Escape') {
		e.preventDefault()
		isOpen.value = false
		searchQuery.value = ''
	} else if (e.key === 'Tab') {
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

	selectedCommand.value = flattenedCommands.value[selectedIndex.value]
	const selectedCommandElement = document.getElementById(selectedCommand.value.id)
	if (selectedCommandElement)
		selectedCommandElement.scrollIntoView({ behavior: 'instant', block: 'center' })
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

function executeCommand(index?: number) {
	selectedIndex.value = index || selectedIndex.value
	if (flattenedCommands.value[selectedIndex.value]) {
		flattenedCommands.value[selectedIndex.value].action()
		isOpen.value = false
		searchQuery.value = ''
		selectedCommand.value = null
		selectedIndex.value = 0
	}
}
</script>

<template>
	<Teleport to="body">
		<div class="command-palette" :class="{ open: isOpen }">
			<Transition name="overlay-fade">
				<div class="overlay" @click="isOpen = false" v-if="isOpen"></div>
			</Transition>
			<Transition name="dialog-slide">
				<div class="command-dialog-wrapper" v-if="isOpen">
					<span class="sr-only"
						>use arrow keys to navigate, enter to select, and escape to close</span
					>
					<div
						class="command-dialog"
						v-if="isOpen"
						ref="commandDialog"
						role="dialog"
						aria-label="Command palette"
					>
						<div class="command-input">
							<FontAwesomeIcon :icon="faMagnifyingGlass" />
							<input
								ref="searchInput"
								type="text"
								v-model="searchQuery"
								placeholder="search commands..."
								aria-controls="command-results"
								:aria-activedescendant="selectedCommand?.id"
								aria-autocomplete="list"
								@blur="
									(e) => {
										if (commandDialog?.contains(e.relatedTarget as Node)) {
											e.preventDefault()
										}
									}
								"
							/>
						</div>
						<div
							class="command-results"
							id="command-results"
							role="listbox"
							aria-label="Available commands"
						>
							<div class="scroll-container" v-if="flattenedCommands.length > 0">
								<div v-for="category in commands" :key="category.name" class="category-container">
									<div class="category-label">{{ category.name }}</div>
									<div class="commands">
										<div
											v-for="command in category.commands"
											:id="command.id"
											:key="command.id"
											:class="[
												'command-container',
												{ selected: command.id === selectedCommand?.id },
											]"
											:aria-selected="command.id === selectedCommand?.id"
											role="option"
											@click="
												executeCommand(flattenedCommands.findIndex((c) => c.id === command.id))
											"
											@onkeydown="handleKeyDown($event)"
										>
											<div class="command-name">{{ command.name }}</div>
											<div class="command-description">{{ command.description }}</div>
										</div>
									</div>
								</div>
							</div>
							<div class="scroll-container" v-else>
								<div class="category-label">no commands found.</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</Teleport>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.command-dialog-wrapper {
	position: fixed;
	top: 20%;
	left: 50%;
	transform: translateX(-50%);
	width: 90%;
	max-width: 600px;
	z-index: 1001;
}

.command-dialog {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
}

.command-palette {
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: hsla(var(--mantle), 0.25);
		backdrop-filter: blur(0.5rem) brightness(0.75);
		z-index: 1000;
	}

	.command-input {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		background: hsl(var(--base));
		border: 1px solid hsla(var(--overlay2) / 0.25);
		border-radius: 50rem;

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
		.scroll-container {
			flex: 1;
			overflow-y: auto;
			max-height: 60dvh;

			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			padding: 0.75rem;
			background: hsl(var(--base));

			border: 1px solid hsla(var(--overlay2) / 0.25);
			border-radius: 1rem;

			scrollbar-width: thin;
			scrollbar-color: hsla(var(--overlay2) / 0.25) transparent;

			&::-webkit-scrollbar {
				width: 0.5rem;
			}

			&::-webkit-scrollbar-track {
				background: transparent;
			}

			&::-webkit-scrollbar-thumb {
				background: hsla(var(--overlay2) / 0.25);
			}
		}

		.category-container {
			max-height: 100%;
			border: 1px solid hsla(var(--overlay1) / 0.25);
			border-radius: 1rem;
			background: hsl(var(--mantle));

			.category-label {
				font-weight: bold;
				margin-bottom: 0.5rem;
				font-size: 1.2rem;
				margin: 0.25rem 1rem;
			}

			.commands {
				border-radius: 0 0 1rem 1rem;
				overflow: hidden;
			}

			.command-container {
				position: relative;
				padding: 0.5rem 1rem;
				transition: background 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

				.command-name {
					font-weight: bolder;
				}

				.command-description {
					color: hsla(var(--subtext0) / 0.8);
				}

				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 95%;
					height: 1px;
					background: hsla(var(--overlay1) / 0.25);
					opacity: 1;
					transition: opacity 0.2s ease-out;
				}

				&:hover {
					background: hsla(var(--overlay0) / 0.25);
					cursor: pointer;
					transition: none;
				}

				&.selected {
					background: hsla(var(--overlay0) / 0.5);
					transition: none;
					&:hover {
						background: hsla(var(--overlay0) / 0.75);
					}
				}
			}
		}
	}
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
	transition: 0.2s ease-out;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
	opacity: 0;
}

.dialog-slide-enter-active,
.dialog-slide-leave-active {
	transition: all 0.2s ease-out;
}

.dialog-slide-enter-from,
.dialog-slide-leave-to {
	opacity: 0;
	filter: blur(1rem);
	transform: translate(-50%, 3rem);
}
</style>
