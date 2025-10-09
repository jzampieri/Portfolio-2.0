import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import Chat from '../views/chat/Chat.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { 
    path: '/chat',
    name: 'chat',
    component: Chat,
    props: route => ({ question: route.query.q || '' })
  },
  { path: '/chat/:id?', name: 'chat', component: () => import('@/views/chat/Chat.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
