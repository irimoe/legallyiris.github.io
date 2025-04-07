import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/home',
			meta: { title: 'home' },
		},
		{
			path: '/home',
			name: 'home',
			component: HomeView,
			meta: { nav: true, title: 'home' },
		},
		{
			path: '/analytics',
			name: 'analytics',
			component: () => import('../views/AnalyticsDashboard.vue'),
			meta: { nav: false, title: 'analytics', commandPalette: true },
		},
		{
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
		},
		{
			path: '/projects',
			name: 'projects',
			children: [
				{
					name: 'projects-root',
					path: '',
					component: () => import('../views/Projects/ProjectsRoot.vue'),
					meta: { title: 'projects' },
				},
				{
					path: ':slug',
					component: () => import('../views/Projects/_slug.vue'),
					meta: { title: 'project' },
				},
			],
			meta: { nav: true },
		},
		{
			path: '/uses',
			name: 'uses',
			component: () => import('../views/UsesView.vue'),
			meta: { nav: true, title: 'uses' },
		},
		{
			path: '/system',
			name: 'system',
			meta: { nav: false, title: 'system', commandPalette: true },
			children: [
				{
					name: 'system-root',
					path: '',
					component: () => import('../views/System/SystemRoot.vue'),
					meta: { title: 'system' },
				},
				{
					path: 'switch',
					name: 'system-switch',
					component: () => import('../views/System/SwitchPortal.vue'),
					meta: { title: 'system switch' },
				},
			],
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('../views/NotFound.vue'),
			meta: { title: 'not found' },
		},
	],
})

router.beforeEach((to, from, next) => {
	document.title = to.meta.title ? `${to.meta.title} - iris` : to.name?.toString() || 'iris'
	next()
})

export default router
