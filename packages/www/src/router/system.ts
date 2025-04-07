export default {
	path: '/system',
	name: 'system',
	meta: {
		title: 'system',
		commandPalette: {
			enabled: true,
			description: "check who's currently fronting and read more about us",
		},
	},
	children: [
		{
			name: 'system root',
			path: '',
			component: () => import('../views/System/SystemRoot.vue'),
		},
		{
			path: 'switch',
			name: 'system switch',
			component: () => import('../views/System/SwitchPortal.vue'),
			meta: { title: 'system switch' },
		},
	],
}
