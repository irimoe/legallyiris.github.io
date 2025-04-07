export default {
	path: '/writing',
	name: 'writing',
	meta: { nav: true, title: 'writing' },
	children: [
		{
			name: 'writing-root',
			path: '',
			component: () => import('../views/Writing/WritingRoot.vue'),
			meta: { title: 'writing' },
		},
		{
			path: ':slug',
			name: 'post',
			component: () => import('../views/Writing/_slug.vue'),
			meta: { title: 'post' },
		},
	],
}
