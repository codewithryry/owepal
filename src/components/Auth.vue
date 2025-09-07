<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 fw-bold mb-4">Sign In to BudgetBuddy</h2>
      <button @click="signInWithGoogle" class="btn btn-primary w-100">Sign in with Google</button>
      <div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase/config'

const error = ref('')

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    console.log('Signed in user:', result.user)
    error.value = ''
    // Emit authenticated event to parent
    emit('authenticated', result.user)
  } catch (err) {
    console.error('Sign-in error:', err)
    error.value = `Error signing in: ${err.message}`
  }
}

const emit = defineEmits(['authenticated'])
</script>
