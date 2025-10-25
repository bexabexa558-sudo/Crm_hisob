import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import MainView from '@/views/MainView.vue'
import ExtraView from '@/views/ExtraView.vue'

const routes = [
  { path: '/', component: LoginView },
  {
    path: '/dashboard',
    component: DashboardView,
    children: [
      { path: 'main', component: MainView },
      { path: 'extra', component: ExtraView },
      { path: '', redirect: '/dashboard/main' }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
