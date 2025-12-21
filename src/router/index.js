import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/history', name: 'history', component: HistoryView },
  { path: '/about', name: 'about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
