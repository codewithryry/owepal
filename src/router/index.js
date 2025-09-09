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
import EditProfile from '../views/EditProfile.vue' 
import BudgetExpense from '../views/BudgetExpense.vue'
import ExportCsv from '../views/ExportCsv.vue'
import BackupCloud from '../views/BackupCloud.vue'



const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true, name: 'Home' } },
  { path: '/login', component: Login, meta: { requiresAuth: false, name: 'Login' } },
  { path: '/debug', component: Debug, meta: { requiresAuth: true, name: 'Debug' } },
  {
    path: '/analytics',
    component: DebtAnalytics,
    meta: { requiresAuth: true, name: 'Debt Analytics' },
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true, name: 'Profile' }
  },
  { path: '/debts', component: DebtTracker, meta: { requiresAuth: true, name: 'Debt Tracker' } },
  { path: '/add', component: Add, meta: { requiresAuth: true, name: 'Add Debt' } },
  { path: '/reminders', component: Reminders, meta: { requiresAuth: true, name: 'Reminders' } },
  { path: '/budget', name: 'BudgetExpense', component: BudgetExpense, meta: { name: 'Budget Expense' } },
  { path: '/export', name: 'ExportCsv', component: ExportCsv, meta: { name: 'Export CSV' } },
  { path: '/backup', name: 'BackupCloud', component: BackupCloud, meta: { name: 'Backup Cloud' } }

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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = await getCurrentUser()

  if (requiresAuth && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/')
  } else {
    // Dynamically set the page title
    document.title = to.meta.name ? `${to.meta.name} ` : 'OwePal'
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
