<template>
  <div
    :class="[
      'min-vh-100 font-sans d-flex flex-column',
      darkMode ? 'bg-dark text-light' : 'bg-light text-dark',
    ]"
  >
    <!-- Header -->
    <header class="sticky-top app-header glass">
      <router-link to="/" class="brand-link">
        <div class="brand-container">
          <h1 class="app-title">UTANG IS LIFE</h1>
          <div class="app-subtitle">eDEBTZero</div>
        </div>
      </router-link>

      <div class="header-actions">
        <div v-if="user" class="user-menu">
          <button @click="toggleUserMenu" class="user-toggle" :class="{ active: userMenuOpen }">
            <img v-if="user.photoURL" :src="user.photoURL" alt="Profile" class="user-avatar" />
            <div v-else class="avatar-placeholder">{{ userInitials }}</div>
          </button>

          <div v-if="userMenuOpen" class="user-dropdown glass">
            <div class="user-info">
              <div class="user-name">{{ user.displayName || user.email || 'User' }}</div>
              <div class="user-email">{{ user.email }}</div>
              <div class="user-id">UID: {{ user.uid.substring(0, 8) }}...</div>
            </div>
            <div class="dropdown-actions">
              <button @click="handleSignOut" class="dropdown-item sign-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12 10V8H8v4H4V4h4v2h2V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2zm-1-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4z"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav glass">
      <router-link to="/" class="nav-item" active-class="active">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"
          />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
        </svg>
        <span class="nav-label">Home</span>
      </router-link>

      <router-link to="/debts" class="nav-item" active-class="active">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"
          />
        </svg>
        <span class="nav-label">Debts</span>
      </router-link>

      <router-link to="/add" class="nav-item add-button" active-class="active">
        <div class="add-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
            />
          </svg>
        </div>
        <span class="nav-label">Add</span>
      </router-link>

      <router-link to="/reminders" class="nav-item" active-class="active">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
          />
        </svg>
        <span class="nav-label">Reminders</span>
      </router-link>

      <router-link to="/analytics" class="nav-item" active-class="active">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 20 V4 H6 L8 10 L10 6 L12 12 L14 8 L16 14 L18 10 L20 16 H22" />
          <rect x="4" y="16" width="2" height="4" />
          <rect x="6" y="14" width="2" height="6" />
          <rect x="8" y="12" width="2" height="8" />
          <rect x="10" y="10" width="2" height="10" />
          <rect x="12" y="8" width="2" height="12" />
          <rect x="14" y="6" width="2" height="14" />
          <rect x="16" y="4" width="2" height="16" />
        </svg>
        <span class="nav-label">Analytics</span>
      </router-link>
    </nav>

    <div v-if="showInfo" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'

const showInfo = ref(false)
const user = ref(null)
const userLoading = ref(true)
const darkMode = ref(false)
const userMenuOpen = ref(false)
const router = useRouter()

const userInitials = computed(() => {
  if (!user.value) return 'U'
  if (user.value.displayName) {
    return user.value.displayName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  return user.value.email ? user.value.email.substring(0, 2).toUpperCase() : 'U'
})

provide('user', user)
provide('darkMode', darkMode)

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    userLoading.value = false
    if (!firebaseUser && router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  })

  if (localStorage.getItem('darkMode') === 'true') {
    darkMode.value = true
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  }

  document.addEventListener('click', closeUserMenu)
})

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)
  document.documentElement.setAttribute('data-bs-theme', darkMode.value ? 'dark' : 'light')
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeUserMenu = (event) => {
  if (!event.target.closest('.user-menu')) {
    userMenuOpen.value = false
  }
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    userMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style scoped>
.font-sans {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

/* Modern Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Brand */
.brand-link {
  text-decoration: none;
  color: inherit;
}
.brand-container {
  display: flex;
  flex-direction: column;
}
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}
.app-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* User Menu */
.user-menu {
  position: relative;
}
.user-toggle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 280px;
  background-color: rgb(146, 141, 141);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  overflow: hidden;
  color: #212529;
}
[data-bs-theme='dark'] .user-dropdown {
  background-color: #2c3034;
  color: #f8f9fa;
}

.user-info {
  padding: 1rem;
  border-bottom: 1px solid #000000;
}
[data-bs-theme='dark'] .user-info {
  border-bottom-color: #495057;
}
.user-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.user-email {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}
.user-id {
  font-size: 0.75rem;
  opacity: 0.6;
}
.dropdown-actions {
  padding: 0.5rem;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.25rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s;
}
.dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
[data-bs-theme='dark'] .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.sign-out {
  color: #dc3545;
}
[data-bs-theme='dark'] .sign-out {
  color: #e6858f;
}

/* Bottom Nav */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  padding: 0.5rem;
  border-top: 1px solid #dee2e6;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
[data-bs-theme='dark'] .bottom-nav {
  background-color: #212529;
  border-top-color: #495057;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  flex: 1;
  max-width: 80px;
}
[data-bs-theme='dark'] .nav-item {
  color: #adb5bd;
}
.nav-item.active {
  color: var(--bs-primary);
}
[data-bs-theme='dark'] .nav-item.active {
  color: #7eb6ff;
}
.nav-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.add-button {
  position: relative;
  margin-top: -1rem;
}
.add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--bs-primary);
  color: white;
  box-shadow: 0 4px 10px rgba(var(--bs-primary-rgb), 0.3);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1rem;
  padding-bottom: calc(1rem + 76px); /* space for bottom nav */
}

/* Frosted Glass */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: inherit;
}
[data-bs-theme='dark'] .glass {
  background: rgba(32, 32, 32, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
