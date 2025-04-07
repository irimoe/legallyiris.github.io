export default {
	path: '/system',
	name: 'system',
	meta: { nav: false, title: 'system', commandPalette: true },
	children: [
		{
			name: 'system root',
			path: '',
			component: () => import('../views/System/SystemRoot.vue'),
			meta: { title: 'system' },
		},
		{
			path: 'switch',
			name: 'system switch',
			component: () => import('../views/System/SwitchPortal.vue'),
			meta: { title: 'system switch' },
		},
	],
}
