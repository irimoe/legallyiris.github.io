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
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('../views/WritingView.vue'),
    },
    {
      path: '/projects',
      children: [
        { path: '', component: () => import('../views/ProjectsView.vue') },
        { path: 'vuecuit', component: () => import('../views/Projects/VuecuitView.vue') },
      ],
    },
    {
      path: '/uses',
      name: 'uses',
      component: () => import('../views/UsesView.vue'),
    },
  ],
})

export default router
