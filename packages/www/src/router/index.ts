import { createRouter, createWebHistory } from 'vue-router'

import { home, uses, analytics, notFound } from './base.ts'
import systemRoutes from './system.ts'
import projectsRoutes from './projects.ts'
import writingRoutes from './writing.ts'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [...home, systemRoutes, projectsRoutes, writingRoutes, uses, analytics, notFound],
})

router.beforeEach((to, from, next) => {
	document.title = to.meta.title ? `${to.meta.title} - iris` : to.name?.toString() || 'iris'
	next()
})

export default router
