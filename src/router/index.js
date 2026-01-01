import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import AboutView from '../views/AboutView.vue'
import StudioView from '../views/StudioView.vue'
import TemplateBuilderView from '../views/TemplateBuilderView.vue'
import PricingView from '../views/PricingView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import TermsView from '../views/TermsView.vue'
import RemixView from '../views/RemixView.vue'

const routes = [
  // Marketing
  { path: '/', name: 'landing', component: LandingView },
  { path: '/pricing', name: 'pricing', component: PricingView },
  { path: '/privacy', name: 'privacy', component: PrivacyView },
  { path: '/terms', name: 'terms', component: TermsView },

  // Viral/sharing routes
  { path: '/remix/:slug', name: 'remix', component: RemixView },

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
