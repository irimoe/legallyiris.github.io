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
      meta: { nav: true },
      children: [
        { name: 'writing-root', path: '', component: () => import('../views/WritingView.vue') },
        {
          path: ':slug',
          name: 'post',
          component: () => import('../views/PostView.vue'),
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
        },
        { path: ':slug', component: () => import('../views/Projects/_slug.vue') },
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
