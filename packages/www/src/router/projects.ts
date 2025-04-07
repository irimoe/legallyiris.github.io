export default {
	path: '/projects',
	name: 'projects',
	meta: {
		title: 'projects',
		nav: true,
		commandPalette: {
			enabled: true,
			description: 'view a list of my projects',
		},
	},

	children: [
		{
			name: 'projects root',
			path: '',
			component: () => import('../views/Projects/ProjectsRoot.vue'),
			meta: {
				title: 'projects',
			},
		},
		{
			path: ':slug',
			component: () => import('../views/Projects/_slug.vue'),
			meta: { title: 'project' },
		},
	],
}
