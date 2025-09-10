<template>
  <div class="settings-container">
    <!-- Features Section -->
    <div class="settings-content glass">
      <div class="settings-title">Features</div>
      <div class="settings-actions">
        <!-- Budget & Expense Tracking -->
        <router-link to="/budget" class="settings-item">
          <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 7H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7zM6 9h12v2H6V9z" />
            <path d="M3 5h18v2H3z" />
          </svg>
          Budget & Expense Tracking
        </router-link>
      </div>
    </div>

    <!-- UI Section -->
    <div class="settings-content glass">
      <div class="settings-actions">
        <!-- Dark Mode Toggle -->
        <button @click="toggleDarkMode" class="settings-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.707l1.414-1.415a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
            />
          </svg>
          {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </div>

    <!-- Backup Section -->
    <div class="settings-content glass">
      <div class="settings-title">Backup</div>
      <div class="settings-actions">
        <!-- Export CSV -->
        <router-link to="/export" class="settings-item">
          <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20h14v-2H5v2z" />
            <path d="M11 16h2V8h3l-4-5-4 5h3v8z" />
          </svg>
          Export as CSV
        </router-link>

        <hr class="settings-divider" />

        <!-- Backup to Cloud (Coming Soon) -->
        <button class="settings-item" disabled title="Coming Soon">
          <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 18H6a4 4 0 1 1 .22-7.998A5 5 0 0 1 18 7a5 5 0 0 1 .9 9.988z"/>
            <path d="M12 12v6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 15l3-3 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Cloud
          <span style="margin-left: 6px; font-size: 0.75rem; color: gray;">(Coming Soon)</span>
        </button>
      </div>
    </div>

    <!-- Advanced Section -->
    <div class="settings-content glass">
      <div class="settings-title">Advanced</div>
      <div class="settings-actions">
        <!-- Debug Mode -->
        <router-link to="/debug" class="settings-item">
          <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-10 10c0 4.41 2.86 8.14 6.82 9.47l-1.41-4.24a6 6 0 0 1 9.18 0l-1.41 4.24A10 10 0 0 0 12 2zm0 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          </svg>
          Debug Mode
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const darkMode = inject('darkMode')
const router = useRouter()

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)
  document.documentElement.setAttribute('data-bs-theme', darkMode.value ? 'dark' : 'light')
}
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Apply Poppins to all elements within the settings container */
.settings-container,
.settings-container * {
  font-family: 'Poppins', sans-serif !important;
  transition: all 0.3s ease;
}

.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  height: 100%;
  gap: 1rem; /* Space between boxes */
}

.settings-content {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: left; /* Align title to the left */
}

.settings-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-item {
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
  font-size: 1rem;
  justify-content: flex-start; /* Align text to the left */
}

.settings-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
[data-bs-theme='dark'] .settings-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.settings-icon {
  width: 16px;
  height: 16px;
}

.settings-divider {
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}
[data-bs-theme='dark'] .settings-divider {
  background: rgba(255, 255, 255, 0.15);
}

/* Glass effect */
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