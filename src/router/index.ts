import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/formulas',
      name: 'formulas',
      component: () => import('../views/FormulaView.vue')
    },
    {
      path: '/formula/:id',
      name: 'formula-detail',
      component: () => import('../views/FormulaDetailView.vue')
    },
    {
      path: '/test-formula',
      name: 'test-formula',
      component: () => import('../views/TestFormulaView.vue')
    },
    {
      path: '/learning-path',
      name: 'learning-path',
      component: () => import('../views/LearningPathView.vue')
    },
    {
      path: '/relationships',
      name: 'relationships',
      component: () => import('../views/RelationshipsView.vue')
    },
    {
      path: '/unified-field',
      name: 'unified-field',
      component: () => import('../views/UnifiedFieldVisualization.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router