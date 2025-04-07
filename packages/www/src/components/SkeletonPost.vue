<script setup lang="ts">
function generateRandomStructure() {
	const sections = []
	sections.push({ type: 'paragraph', lines: 2 + Math.floor(Math.random() * 4) })

	const sectionCount = 3 + Math.floor(Math.random() * 5)
	for (let i = 0; i < sectionCount; i++) {
		const r = Math.random()
		if (r < 0.2) {
			sections.push({ type: 'heading' })
			sections.push({ type: 'paragraph', lines: 2 + Math.floor(Math.random() * 4) })
		} else if (r < 0.4) {
			sections.push({ type: 'code' })
		} else {
			sections.push({ type: 'paragraph', lines: 1 + Math.floor(Math.random() * 5) })
		}
	}
	return sections
}
</script>

<template>
	<div class="loading-skeleton">
		<div class="skeleton-title"></div>

		<div class="skeleton-meta">
			<div class="skeleton-date"></div>
			<div class="skeleton-reading-time"></div>
		</div>

		<hr />

		<template v-for="(section, i) in generateRandomStructure()" :key="i">
			<div v-if="section.type === 'paragraph'" class="skeleton-paragraph">
				<div
					class="skeleton-line"
					v-for="j in section.lines"
					:key="`p${i}-${j}`"
					:style="{ width: `${60 + Math.random() * 40}%` }"
				></div>
			</div>

			<div v-else-if="section.type === 'heading'" class="skeleton-heading"></div>

			<div v-else-if="section.type === 'code'" class="skeleton-code-block"></div>
		</template>
	</div>
</template>

<style scoped lang="scss">
.loading-skeleton {
	.skeleton-title,
	.skeleton-line {
		background: hsla(var(--surface0) / 0.7);
		border-radius: 0.25rem;
		margin-bottom: 0.5rem;
		animation: pulse 1.5s infinite;
	}
	.skeleton-title {
		height: 2rem;
		width: 70%;
	}
	.skeleton-line {
		height: 1rem;
		width: 100%;
	}
}

.skeleton-title,
.skeleton-line {
	background: linear-gradient(
		90deg,
		hsla(var(--surface0) / 0.6) 25%,
		hsla(var(--surface0) / 0.8) 50%,
		hsla(var(--surface0) / 0.6) 75%
	);
	background-size: 200% 100%;
	animation: shimmer 2s infinite;
}

.skeleton-meta {
	display: flex;
	gap: 1rem;
	margin: 0.5rem 0 1rem;
}

.skeleton-date,
.skeleton-reading-time {
	height: 0.875rem;
	width: 5rem;
	background: hsla(var(--surface0) / 0.7);
	border-radius: 0.25rem;
	animation: pulse 1.5s infinite;
}

.skeleton-heading {
	height: 1.5rem;
	width: 40%;
	margin: 2rem 0 1rem;
	background: hsla(var(--surface0) / 0.7);
	border-radius: 0.25rem;
	animation: pulse 1.5s infinite;
}

.skeleton-paragraph {
	margin: 1rem 0;
}

.skeleton-code-block {
	height: 5rem;
	width: 100%;
	margin: 1rem 0;
	background: hsla(var(--mantle) / 1);
	border: 1px solid hsla(var(--overlay0) / 0.5);
	border-radius: 0.5rem;
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		opacity: 0.6;
	}
	50% {
		opacity: 0.3;
	}
	100% {
		opacity: 0.6;
	}
}

@keyframes shimmer {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}
</style>
