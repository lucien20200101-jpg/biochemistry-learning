import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'pathways',
        name: 'Pathways',
        component: () => import('../views/Pathways.vue'),
      },
      {
        path: 'pathways/:id',
        name: 'PathwayDetail',
        component: () => import('../views/PathwayDetail.vue'),
      },
      {
        path: 'network',
        name: 'Network',
        component: () => import('../views/Network.vue'),
      },
      {
        path: 'quiz',
        name: 'Quiz',
        component: () => import('../views/Quiz.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
