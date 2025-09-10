<template>
  <div
    :class="[
      'min-vh-100 font-sans d-flex flex-column',
      darkMode ? 'bg-dark text-light' : 'bg-light text-dark',
    ]"
  >
    <!-- Fixed Header (Hidden on login page) -->
    <header v-if="route.path !== '/owePal'" class="header glass">
      <div class="header-content">
        <!-- Profile on the left -->
        <div v-if="user" class="profile-avatar" @click="toggleAccountMenu">
          <img v-if="user.photoURL" :src="user.photoURL" alt="Profile" class="user-avatar" />
          <div v-else class="avatar-placeholder">{{ userInitials }}</div>
        </div>
        <!-- Page title in the center -->
        <div class="header-title">
          {{ currentPageTitle }}
        </div>
        <!-- Reminders icon on the right -->
        <router-link
          v-if="$route.path !== '/login'"
          to="/reminders"
          class="reminders-icon"
        >
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
        </router-link>

      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Bottom Navigation Bar (Hidden on login page) -->
    <nav v-if="route.path !== '/login' && route.path !== '/owePal'" class="bottom-nav glass">
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

            <router-link to="/settings" class="nav-item" active-class="active">
        <svg
          viewBox="0 -0.5 21 21"
          width="24"
          height="24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Dribbble-Light-Preview" transform="translate(-59.000000, -200.000000)" fill="currentColor">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path
                    d="M14.55,60 L24,60 L24,51 L14.55,51 L14.55,60 Z M3,60 L12.45,60 L12.45,51 L3,51 L3,60 Z M14.55,49 L24,49 L24,40 L14.55,40 L14.55,49 Z M3,49 L12.45,49 L12.45,40 L3,40 L3,49 Z"
                    id="menu_navigation_grid-[#1530]"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span class="nav-label">More</span>
      </router-link>

    </nav>
    
    <!-- Account Settings Dropdown Menu -->
    <div v-if="accountMenuOpen" class="user-dropdown-container">
      <div class="user-dropdown-overlay" @click="toggleAccountMenu"></div>
      <div class="user-dropdown-content glass">
        <div class="user-info">
          <div class="profile-avatar-large">
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              alt="Profile"
              class="user-avatar-large"
            />
            <div v-else class="avatar-placeholder-large">{{ userInitials }}</div>
          </div>
          <div class="user-details">
            <div class="user-name">{{ user.displayName || user.email || 'User' }}</div>
            <div class="user-email">{{ user.email }}</div>
            <div class="user-id">UID: {{ user.uid.substring(0, 8) }}...</div>
          </div>
        </div>
        <div class="dropdown-actions">
          <router-link to="/edit-profile" class="dropdown-item" @click="toggleAccountMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
              />
            </svg>
            Edit Profile
          </router-link>
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

    <div v-if="showInfo" class="modal-backdrop fade show"></div>
  </div>

  <!-- AI Assistant Component -->
  <!-- <AiAssistant v-if="route.path !== '/login'" /> -->
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import AiAssistant from './components/AiAssistant.vue'

const showInfo = ref(false)
const user = ref(null)
const userLoading = ref(true)
const darkMode = ref(false)
const accountMenuOpen = ref(false)
const router = useRouter()
const route = useRoute()

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

const currentPageTitle = computed(() => {
  switch (route.path) {
    case '/':
      return 'DASHBOARD'
    case '/debts':
      return 'DEBTS'
    case '/add':
      return 'ADD DEBT'
    case '/reminders':
      return 'REMINDERS'
    case '/analytics':
      return 'ANALYTICS'
    case '/debug':
      return 'DEBUG'
    case '/edit-profile':
      return 'EDIT PROFILE'
    case '/login':
      return 'LOGIN'
    case '/settings':
      return 'SETTINGS'
    default:
      return 'DASHBOARD'
  }
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
})

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    accountMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style scoped>
.font-sans {
  font-family: 'Poppins', sans-serif;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
}
[data-bs-theme='dark'] .header {
  background: rgba(33, 33, 33, 0.95);
  border-bottom-color: #495057;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  flex: 1;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}
[data-bs-theme='dark'] .avatar-placeholder {
  background-color: rgba(255, 255, 255, 0.2);
}

.reminders-icon {
  cursor: pointer;
  padding: 0.5rem;
  color: inherit;
  text-decoration: none;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #dee2e6;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.5rem 0;
}
[data-bs-theme='dark'] .bottom-nav {
  background-color: rgba(33, 33, 33, 0.95);
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
  cursor: pointer;
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

.main-content {
  flex: 1;
  padding: 1rem;
  padding-top: calc(1rem + 56px); /* Adjust for header height */
  padding-bottom: calc(1rem + 76px); /* Adjust for bottom nav */
}

/* Account Dropdown Styles */
.user-dropdown-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
}

.user-dropdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.user-dropdown-content {
  position: relative;
  width: 100%;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 1.5rem;
  z-index: 2001;
  animation: slideUp 0.3s ease-out;
}
[data-bs-theme='dark'] .user-dropdown-content {
  background-color: #2a2a2a;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.user-dropdown-container {
  z-index: 9999; /* force above AI Assistant */
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.user-avatar-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
}
[data-bs-theme='dark'] .avatar-placeholder-large {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-details {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-id {
  font-size: 0.75rem;
  opacity: 0.6;
}

.dropdown-actions {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}
[data-bs-theme='dark'] .dropdown-actions {
  border-top-color: #495057;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
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

/* Glass effect with less transparency */
.glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: inherit;
}
[data-bs-theme='dark'] .glass {
  background: rgba(40, 40, 40, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
}
</style>