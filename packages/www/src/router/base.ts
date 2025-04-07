import HomeView from '../views/HomeView.vue'

export const home = [
	{
		path: '/',
		redirect: '/home',
		meta: { title: 'home' },
	},
	{
		path: '/home',
		name: 'home',
		component: HomeView,
		meta: {
			nav: true,
			title: 'home',
			commandPalette: {
				enabled: true,
				description: 'go to the home page',
			},
		},
	},
]

export const uses = {
	path: '/uses',
	name: 'uses',
	component: () => import('../views/UsesView.vue'),
	meta: {
		nav: true,
		title: 'uses',
		commandPalette: {
			enabled: true,
			description: 'view the list of things that i use in my life',
		},
	},
}

export const analytics = {
	path: '/analytics',
	name: 'analytics',
	component: () => import('../views/AnalyticsDashboard.vue'),
	meta: {
		nav: false,
		title: 'analytics',
		commandPalette: {
			enabled: true,
			description: 'view anonymous analytics for the website',
		},
	},
}

export const notFound = {
	path: '/:pathMatch(.*)*',
	name: 'not found',
	component: () => import('../views/NotFound.vue'),
	meta: { title: 'not found' },
}
