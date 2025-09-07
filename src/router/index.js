import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

// Views
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Debug from '../views/Debug.vue'
import DebtAnalytics from '../views/DebtAnalytics.vue'
import DebtTracker from '../views/DebtTracker.vue'
import Add from '../views/Add.vue'
import Reminders from '../views/Reminders.vue'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  { path: '/debug', component: Debug, meta: { requiresAuth: true } },
  { path: '/analytics', component: DebtAnalytics, meta: { requiresAuth: true } },
  { path: '/debts', component: DebtTracker, meta: { requiresAuth: true } },
  { path: '/add', component: Add, meta: { requiresAuth: true } },
  { path: '/reminders', component: Reminders, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let currentUser = null
let authResolved = false

function getCurrentUser() {
  return new Promise((resolve) => {
    if (authResolved) {
      resolve(currentUser)
    } else {
      const unsub = onAuthStateChanged(auth, (user) => {
        currentUser = user
        authResolved = true
        unsub()
        resolve(user)
      })
    }
  })
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const user = await getCurrentUser()

  if (requiresAuth && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/')
  } else {
    next()
  }
})

onAuthStateChanged(auth, (user) => {
  currentUser = user
  if (!user && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login')
  }
  if (user && router.currentRoute.value.path === '/login') {
    router.push('/')
  }
})

export default router
