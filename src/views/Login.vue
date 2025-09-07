<template>
  <div class="container py-5">
    <h2 class="mb-4">Login</h2>
    <Auth @authenticated="handleAuthentication" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Auth from '../components/Auth.vue'

const router = useRouter()

const handleAuthentication = (user) => {
  console.log('User authenticated:', user)
  router.push('/debts') // SPA redirect, not a full reload
}
</script>
