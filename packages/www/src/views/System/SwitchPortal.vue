<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFrontingStore } from '@/stores/fronting'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import AlterCard from '@/components/system/AlterCard.vue'

const frontingStore = useFrontingStore()
const tokenInput = ref('')
const selectedAlters = ref<string[]>([])
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const tokenValid = computed(() => tokenInput.value.length >= 8)

const isMultiple = computed(() => selectedAlters.value.length > 1)

onMounted(async () => {
	await Promise.all([frontingStore.fetchFrontingState(), frontingStore.fetchAllAlters()])

	if (frontingStore.frontingState?.alters) {
		selectedAlters.value = frontingStore.frontingState.alters.map((a) => a.id)
	}
})

async function submitSwitch() {
	if (!tokenValid.value) {
		errorMessage.value = 'token is required (min 8 characters)'
		return
	}

	errorMessage.value = ''
	successMessage.value = ''
	submitting.value = true

	try {
		const success = await frontingStore.updateFronting(selectedAlters.value, tokenInput.value)

		if (success) {
			successMessage.value =
				selectedAlters.value.length === 0
					? 'successfully set to blurry state (no one fronting)'
					: `successfully updated fronting state`

			tokenInput.value = ''
		} else {
			errorMessage.value = frontingStore.error || 'unknown error occurred'
		}
	} finally {
		submitting.value = false
	}
}

function toggleAlter(id: string) {
	if (selectedAlters.value.includes(id)) {
		selectedAlters.value = selectedAlters.value.filter((a) => a !== id)
	} else {
		selectedAlters.value.push(id)
	}
}
</script>

<template>
	<h1>system switch place</h1>
	<hr />

	<div v-if="frontingStore.loading">loading alters...</div>

	<form v-else @submit.prevent="submitSwitch" class="switch-form">
		<div class="auth-section">
			<label for="token"><h2>auth token</h2></label>
			<input
				id="token"
				type="password"
				v-model="tokenInput"
				placeholder="how many mice are eaten by cats each year"
				autocomplete="off"
			/>
		</div>

		<div class="alter-selection">
			<div class="section-title">
				<h2>select who's fronting</h2>
				<div class="selection-controls">
					<button
						type="button"
						@click="selectedAlters = frontingStore.allAlters.map((a) => a.id)"
						class="control-button"
					>
						all
					</button>
					<button type="button" @click="selectedAlters = []" class="control-button">none</button>
				</div>
			</div>

			<div class="alters-list">
				<AlterCard
					v-for="alter in frontingStore.allAlters"
					:key="alter.id"
					:alter="alter"
					:is-selectable="true"
					:is-selected="selectedAlters.includes(alter.id)"
					@select="toggleAlter"
				/>
			</div>
		</div>

		<div class="fronting-summary">
			<p v-if="selectedAlters.length === 0">
				<strong>blurry state:</strong> no one will be fronting
			</p>
			<p v-else-if="selectedAlters.length === 1">
				<strong>single fronting:</strong>
				{{ frontingStore.allAlters.find((a) => a.id === selectedAlters[0])?.name }} will be the only
				alter fronting
			</p>
			<p v-else>
				<strong>co-fronting:</strong> {{ selectedAlters.length }} alters will be co-fronting
			</p>
		</div>

		<div class="messages" v-if="errorMessage || successMessage">
			<p v-if="errorMessage" class="error-message">
				<FontAwesomeIcon :icon="faTimes" /> {{ errorMessage }}
			</p>
			<p v-if="successMessage" class="success-message">
				<FontAwesomeIcon :icon="faCheck" /> {{ successMessage }}
			</p>
		</div>

		<div class="form-actions">
			<button type="submit" class="submit-button" :disabled="submitting || !tokenValid">
				{{ submitting ? 'updating...' : isMultiple ? 'update co-fronting' : 'update fronting' }}
			</button>
			<router-link to="/system" class="cancel-button">
				<FontAwesomeIcon :icon="faArrowLeft" /> back to system
			</router-link>
		</div>
	</form>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.switch-form {
	background: hsla(var(--mantle) / 0.6);
	border: 1px solid hsla(var(--overlay0) / 0.5);
	border-radius: 0.75rem;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.auth-section {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	label {
		font-size: 0.875rem;
		font-weight: 600;
	}

	input {
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: hsla(var(--surface0) / 0.8);
		border: 1px solid hsla(var(--overlay0) / 0.5);
		color: hsl(var(--text));
		font-size: 0.9rem;
		transition: $transition;

		&:focus {
			outline: none;
			border-color: hsla(var(--blue) / 0.8);
			background: hsla(var(--surface0) / 1);
			box-shadow: 0 0 0 2px hsla(var(--blue) / 0.2);
		}
	}
}

.section-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.75rem;

	h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	.selection-controls {
		display: flex;
		gap: 0.5rem;

		.control-button {
			padding: 0.25rem 0.5rem;
			font-size: 0.75rem;
			background: hsla(var(--surface0) / 0.8);
			border: 1px solid hsla(var(--overlay0) / 0.5);
			border-radius: 0.25rem;
			color: hsl(var(--text));
			cursor: pointer;
			transition: $transition;

			&:hover {
				background: hsla(var(--surface1) / 0.8);
			}
		}
	}
}

.alters-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.fronting-summary {
	font-size: 0.9rem;
	padding: 0.75rem;
	border-radius: 0.5rem;
	background: hsla(var(--surface0) / 0.6);
	border: 1px solid hsla(var(--overlay0) / 0.4);

	p {
		margin: 0;
		color: hsla(var(--text) / 0.9);

		strong {
			color: hsl(var(--text));
			font-weight: 600;
		}
	}
}

.messages {
	min-height: 1.5rem;

	.error-message {
		color: hsl(var(--red));
		font-size: 0.875rem;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.success-message {
		color: hsl(var(--green));
		font-size: 0.875rem;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
}

.form-actions {
	display: flex;
	gap: 1rem;

	.submit-button,
	.cancel-button {
		padding: 0.65rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.9rem;
		transition: $transition;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.submit-button {
		background: hsla(var(--blue) / 0.2);
		color: hsl(var(--blue));
		border: 1px solid hsla(var(--blue) / 0.5);
		cursor: pointer;

		&:hover:not(:disabled) {
			background: hsla(var(--blue) / 0.3);
			transform: translateY(-1px);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.cancel-button {
		background: hsla(var(--overlay0) / 0.2);
		color: hsl(var(--text));
		border: 1px solid hsla(var(--overlay0) / 0.5);
		text-decoration: none;
		display: flex;
		align-items: center;

		&:hover {
			background: hsla(var(--overlay0) / 0.3);
			transform: translateY(-1px);
		}
	}
}
</style>
