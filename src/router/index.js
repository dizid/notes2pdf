import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import AboutView from '../views/AboutView.vue'
import StudioView from '../views/StudioView.vue'
import TemplateBuilderView from '../views/TemplateBuilderView.vue'

const routes = [
  // Marketing
  { path: '/', name: 'landing', component: LandingView },

  // App routes
  { path: '/app', name: 'home', component: HomeView },
  { path: '/app/studio', name: 'studio', component: StudioView },
  { path: '/app/studio/builder', name: 'builder', component: TemplateBuilderView },
  { path: '/app/history', name: 'history', component: HistoryView },
  { path: '/app/about', name: 'about', component: AboutView },

  // Legacy redirects
  { path: '/studio', redirect: '/app/studio' },
  { path: '/history', redirect: '/app/history' },
  { path: '/about', redirect: '/app/about' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
