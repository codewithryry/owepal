<template>
  <div class="profile-container">
    <div class="profile-content glass">
      <form @submit.prevent="handleUpdateProfile" class="edit-profile-form">
        <div class="form-group">
          <label for="displayName" class="form-label">Display Name</label>
          <input v-model="form.displayName" type="text" id="displayName" class="form-control" placeholder="Enter your display name" required>
        </div>
        <hr class="form-divider" />
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input v-model="form.email" type="email" id="email" class="form-control" placeholder="Enter your email" required>
        </div>
        <hr class="form-divider" />
        <div class="form-group">
          <label for="photoURL" class="form-label">Profile Photo URL (optional)</label>
          <input v-model="form.photoURL" type="url" id="photoURL" class="form-control" placeholder="Enter a valid image URL (e.g., from Gravatar or Imgur)">
          <div v-if="form.photoURL" class="mt-2">
            <img :src="form.photoURL" alt="Preview" class="img-thumbnail preview-img" @error="handleImageError">
          </div>
        </div>
        <div class="d-flex gap-2 mt-4">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
          <router-link to="/" class="btn btn-secondary">Cancel</router-link>
        </div>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3">Profile updated successfully! Redirecting...</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updateProfile, updateEmail } from 'firebase/auth'
import { auth } from '../firebase/config' // Adjust path if needed

const router = useRouter()
const form = ref({
  displayName: '',
  email: '',
  photoURL: ''
})
const error = ref('')
const success = ref(false)
const loading = ref(false)

onMounted(() => {
  if (auth.currentUser) {
    form.value.displayName = auth.currentUser.displayName || ''
    form.value.email = auth.currentUser.email || ''
    form.value.photoURL = auth.currentUser.photoURL || ''
  } else {
    router.push('/login')
  }
})

const handleImageError = () => {
  form.value.photoURL = '' // Clear invalid URL
  error.value = 'Invalid image URL. Please check and try again.'
}

const handleUpdateProfile = async () => {
  if (!auth.currentUser) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Update profile details
    await updateProfile(auth.currentUser, {
      displayName: form.value.displayName.trim() || null,
      photoURL: form.value.photoURL.trim() || null
    })

    // Update email if it has changed
    if (form.value.email.trim() && form.value.email !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, form.value.email.trim())
    }

    success.value = true
    setTimeout(() => router.push('/'), 1500)
  } catch (err) {
    error.value = err.message || 'Failed to update profile.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
    font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  height: 100%;
}

.profile-content {
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
}

.profile-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: left;
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.5rem;
}

.form-control {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ced4da;
  background: transparent;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.preview-img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.form-divider {
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.alert {
  padding: 0.75rem;
  border-radius: 0.5rem;
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

/* Dark mode styles */
[data-bs-theme='dark'] .glass {
  background: rgba(40, 40, 40, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
}

[data-bs-theme='dark'] .form-control {
  background-color: #343a40;
  color: #fff;
  border-color: #495057;
}

[data-bs-theme='dark'] .form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(128, 189, 255, 0.25);
}

[data-bs-theme='dark'] .form-divider {
  background: rgba(255, 255, 255, 0.15);
}

[data-bs-theme='dark'] .img-thumbnail {
  background-color: #495057;
  border-color: #6c757d;
}

[data-bs-theme='dark'] .btn-primary {
  background-color: #80bdff;
  color: #000;
}

[data-bs-theme='dark'] .btn-primary:hover {
  background-color: #60a5fa;
}

[data-bs-theme='dark'] .btn-secondary {
  background-color: #5a6268;
}

[data-bs-theme='dark'] .btn-secondary:hover {
  background-color: #4b5156;
}
</style>