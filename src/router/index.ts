import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { nav: true },
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('../views/WritingView.vue'),
      meta: { nav: true },
    },
    {
      path: '/projects',
      name: 'projects',
      children: [
        { path: '', component: () => import('../views/ProjectsView.vue') },
        { path: 'vuecuit', component: () => import('../views/Projects/VuecuitView.vue') },
      ],
      meta: { nav: true },
    },
    {
      path: '/uses',
      name: 'uses',
      component: () => import('../views/UsesView.vue'),
      meta: { nav: true },
    },
  ],
})

export default router
