<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/analytics'
import { onMounted, computed } from 'vue'

const analyticsStore = useAnalyticsStore()

const hits = computed(() => analyticsStore.analyticsData?.hits ?? [])
const uniques = computed(() => analyticsStore.analyticsData?.uniques ?? [])

onMounted(() => {
	analyticsStore.fetchAnalyticsData()
})
</script>

<template>
	<h1>analytics dashboard</h1>
	<hr />

	<div v-if="analyticsStore.loading">loading analytics...</div>
	<div v-else-if="analyticsStore.error">error fetching analytics: {{ analyticsStore.error }}</div>
	<div v-else-if="analyticsStore.analyticsData" class="dashboard-content">
		<section class="privacy-info">
			<h2>privacy information</h2>
			<p>
				i believe in privacy and transparency, and i'm strongly against corporate surveillance and
				data harvesting. that's why i built this simple, in-house analytics system instead of using
				invasive tools like google analytics.
			</p>
			<ul>
				<li>
					<strong>what's tracked:</strong> when you visit a page, the server logs the path (e.g.,
					<code>/writing/my-system</code>), the current date, and a hash of your ip address.
				</li>
				<li>
					<strong>ip addresses:</strong> your ip address is immediately hashed using a fast,
					non-cryptographic algorithm (wyhash). the raw ip is *never* stored. hashing is a one-way
					process, making it very difficult to recover the original ip. this allows counting unique
					visitors per day without storing personally identifiable information long-term.
				</li>
				<li>
					<strong>no cookies or third-party trackers:</strong> this site does not use cookies for
					tracking, fingerprinting, or any third-party analytics services.
				</li>
				<li>
					<strong>purpose:</strong> this pretty much just serves the purpose of satisfying my
					curiosity about whether people actually view my site.
				</li>
				<li>
					<strong>storage:</strong> the data (path, hit count, hashed ip, date) is stored locally in
					a sqlite database on my server (the raspberry pi).
				</li>
				<li>
					<strong>publicity:</strong> the collected data is publicly available via the
					<a href="/api/analytics"><code>GET /api/analytics</code></a> endpoint, which returns a
					JSON object containing numerical data about the site's usage, not including your hashed ip
					address.
				</li>
			</ul>
			<p>
				this approach respects your privacy while still satisfying my curiosity about site usage.
			</p>
			<p>
				also note that if your browser or application sends the
				<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/DNT"
					><code>dnt</code></a
				>
				header, it will be respected and no data will be collected.
			</p>
		</section>

		<section>
			<h2>page hits</h2>
			<p>total requests per path, ordered by most hits.</p>
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>path</th>
							<th>hits</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="hit in hits" :key="hit.path">
							<td class="path-cell">{{ hit.path }}</td>
							<td>{{ hit.hits }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<section>
			<h2>daily unique visitors</h2>
			<p>unique visitors (hashed ip) per path per day.</p>
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>date</th>
							<th>path</th>
							<th>uniques</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(unique, index) in uniques" :key="`${unique.path}-${unique.date}-${index}`">
							<td>{{ unique.date }}</td>
							<td class="path-cell">{{ unique.path }}</td>
							<td>{{ unique.unique_visits }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	</div>
	<div v-else>no analytics data available.</div>
</template>

<style scoped lang="scss">
@use '@/css/_variables.scss' as *;

.dashboard-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 1rem;
}

section {
	background: hsla(var(--mantle) / 0.6);
	border: 1px solid hsla(var(--overlay0) / 0.5);
	border-radius: 0.75rem;
	padding: 1rem;
}

h2 {
	margin-top: 0;
	margin-bottom: 0.75rem;
	color: hsla(var(--text) / 1);
	font-size: 1.25rem;
}

p {
	font-size: 0.875rem;
	color: hsla(var(--subtext0) / 1);
	margin-bottom: 0.75rem;
	line-height: 1.6;
}

.privacy-info {
	ul {
		padding-left: 1.25rem;
		margin-bottom: 1rem;
		li {
			margin-bottom: 0.5rem;
			font-size: 0.875rem;
			color: hsla(var(--subtext0) / 1);
			code {
				background: hsla(var(--surface0) / 0.8);
				padding: 0.1em 0.4em;
				border-radius: 0.25rem;
				font-size: 0.9em;
				color: hsla(var(--text) / 1);
			}
			strong {
				color: hsla(var(--text) / 1);
				font-weight: 600;
			}
		}
	}
}

.table-wrapper {
	min-height: 512px;
	max-height: 768px;
	overflow-y: auto;
	border-radius: 0.5rem;
	border: 1px solid hsla(var(--overlay0) / 0.5);

	scrollbar-width: thin;
	scrollbar-color: hsla(var(--surface2) / 0.8) hsla(var(--mantle) / 0.6);

	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-track {
		background: hsla(var(--mantle) / 0.6);
		border-radius: 0.5rem;
	}
	&::-webkit-scrollbar-thumb {
		background-color: hsla(var(--surface2) / 0.8);
		border-radius: 4px;
		border: 2px solid hsla(var(--mantle) / 0.6);
	}
}

table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.875rem;

	th,
	td {
		padding: 0.5rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid hsla(var(--overlay0) / 0.5);
		white-space: nowrap;
	}

	thead {
		background: hsla(var(--surface0) / 1);
		font-weight: bold;
		color: hsla(var(--text) / 1);
		position: sticky;
		top: 0;
		z-index: 1;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	td:nth-child(2),
	td:nth-child(3) {
		text-align: right;
		font-family: 'JetBrains Mono', monospace;
	}

	tbody tr:hover {
		background-color: hsla(var(--surface1) / 0.5);
	}

	.path-cell {
		white-space: normal;
		word-break: break-all;
		max-width: 250px;
	}
}
</style>
