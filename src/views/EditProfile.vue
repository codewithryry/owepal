<template>
  <form @submit.prevent="handleUpdateProfile" class="edit-profile-form">
    <div class="mb-3">
      <label for="displayName" class="form-label">Display Name</label>
      <input v-model="form.displayName" type="text" id="displayName" class="form-control" placeholder="Enter your display name" required>
    </div>
    <div class="mb-3">
      <label for="photoURL" class="form-label">Profile Photo URL (optional)</label>
      <input v-model="form.photoURL" type="url" id="photoURL" class="form-control" placeholder="Enter a valid image URL (e.g., from Gravatar or Imgur)">
      <div v-if="form.photoURL" class="mt-2">
        <img :src="form.photoURL" alt="Preview" class="img-thumbnail preview-img" @error="handleImageError">
      </div>
    </div>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else="">Save Changes</span>
      </button>
      <router-link to="/" class="btn btn-secondary">Cancel</router-link>
    </div>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    <div v-if="success" class="alert alert-success mt-3">Profile updated successfully! Redirecting...</div>
  </form>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/config' // Adjust path if needed

const router = useRouter()
const form = ref({
  displayName: '',
  photoURL: ''
})
const error = ref('')
const success = ref(false)
const loading = ref(false)

onMounted(() => {
  if (auth.currentUser) {
    form.value.displayName = auth.currentUser.displayName || ''
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
    await updateProfile(auth.currentUser, {
      displayName: form.value.displayName.trim() || null,
      photoURL: form.value.photoURL.trim() || null
    })
    success.value = true
    // Refresh user in parent (via onAuthStateChanged, which will trigger)
    setTimeout(() => router.push('/'), 1500)
  } catch (err) {
    error.value = err.message || 'Failed to update profile.'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.edit-profile-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.preview-img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

[data-bs-theme='dark'] .form-control,
[data-bs-theme='dark'] .form-label {
  background-color: #343a40;
  color: #fff;
  border-color: #495057;
}

[data-bs-theme='dark'] .img-thumbnail {
  background-color: #495057;
  border-color: #6c757d;
}
</style>