export default {
	path: '/writing',
	name: 'writing',
	meta: {
		nav: true,
		title: 'writing',
		commandPalette: {
			enabled: true,
			description: 'view a list of my written posts',
		},
	},
	children: [
		{
			name: 'writing-root',
			path: '',
			component: () => import('../views/Writing/WritingRoot.vue'),
			meta: {
				title: 'writing',
			},
		},
		{
			path: ':slug',
			name: 'post',
			component: () => import('../views/Writing/_slug.vue'),
			meta: { title: 'post' },
		},
	],
}
