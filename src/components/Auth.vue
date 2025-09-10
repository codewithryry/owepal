<template>
  <div class="login-container">
    <div class="card">
      <div class="card-body">

        <!-- Email Field (Disabled) -->
        <div class="mb-3">
          <label for="email" class="form-label small text-secondary mb-2">Email address</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="fas fa-envelope text-muted"></i>
            </span>
            <input 
              type="email" 
              class="form-control ps-2 border-start-0" 
              id="email" 
              placeholder="Enter your email" 
              disabled 
            />
          </div>
          <div class="form-text mt-2 d-flex align-items-center">
            <i class="fas fa-info-circle me-2"></i>
            <span>Email login is currently disabled</span>
          </div>
        </div>

        <!-- Password Field (Disabled) -->
        <div class="mb-4">
          <label for="password" class="form-label small text-secondary mb-2">Password</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="fas fa-lock text-muted"></i>
            </span>
            <input 
              type="password" 
              class="form-control ps-2 border-start-0" 
              id="password" 
              placeholder="Enter your password" 
              disabled 
            />
          </div>
          <div class="form-text mt-2 d-flex align-items-center">
            <i class="fas fa-info-circle me-2"></i>
            <span>Password login is currently disabled</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider my-3 position-relative text-center">
          <span class="px-3 bg-white text-muted small position-relative">Or continue with</span>
        </div>

        <!-- Google Sign-in Button -->
        <button 
          @click="signInWithGoogle" 
          class="btn btn-google w-100 d-flex align-items-center justify-content-center gap-3 py-2"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else class="d-flex align-items-center gap-3">
            <!-- Google SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.5-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 15.1 18.8 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.5 0-13.9 4.2-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.6-5.2l-6.3-5.2C29.2 35.9 26.7 37 24 37c-5.3 0-9.7-3.4-11.3-8H6.3l-6.6 5.1C10.1 39.8 16.5 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5h-1.9V20H24v8h11.3c-.7 2-2.1 3.8-3.8 5.1l6.3 5.2c-.2.2 6.2-4.5 6.2-13.3 0-1.3-.1-2.5-.4-3.5z"/>
            </svg>
            Continue with Google
          </span>
        </button>

        <!-- Error Alert -->
        <div v-if="error" class="mt-3 alert alert-custom alert-danger small mb-0 d-flex align-items-center">
          <i class="fas fa-exclamation-circle me-2"></i>
          <div>{{ error }}</div>
        </div>

        <!-- Footer -->
        <div class="mt-3 text-center">
          <p class="small text-muted">By continuing, you agree to our <a href="#" class="text-decoration-none">Terms of Service</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase/config'

const error = ref('')
const loading = ref(false)

const emit = defineEmits(['authenticated'])

const signInWithGoogle = async () => {
  error.value = ''
  loading.value = true
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    console.log('Signed in user:', result.user)
    emit('authenticated', result.user)
  } catch (err) {
    console.error('Sign-in error:', err)
    error.value = mapFirebaseError(err)
  } finally {
    loading.value = false
  }
}

// Friendly error messages
function mapFirebaseError(err) {
  if (err.code === 'auth/popup-closed-by-user') return 'Sign-in was canceled.'
  if (err.code === 'auth/network-request-failed') return 'Network error. Please try again.'
  return 'Unable to sign in. Please try again later.'
}
</script>

<style scoped>
.login-container {
  margin-top: -2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.card-body {
  padding: 2rem;
}

.brand-logo {
  height: 60px;
  width: auto;
}

.input-group-text {
  background-color: #f8fafc !important;
  border: 1px solid #e2e8f0;
  border-right: none;
  padding: 0.6rem;
}

.form-control {
  border-left: none;
  padding: 0.6rem;
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.form-control:disabled {
  background-color: #f8fafc;
  opacity: 0.7;
  cursor: not-allowed;
}

.form-text {
  color: #64748b;
  font-size: 0.75rem;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
  z-index: -1;
}

.btn-google {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-google:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e0;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-google:active:not(:disabled) {
  transform: translateY(0);
}

.alert-custom {
  border: none;
  border-radius: 8px;
  background: #fef2f2;
  color: #ef4444;
  padding: 0.6rem 0.8rem;
}

@media (max-width: 480px) {
  .login-container {
    margin-top: -12rem;
  }
  .card-body {
    padding: 1.5rem;
  }
}
</style>