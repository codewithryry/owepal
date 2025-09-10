<template>
  <div>
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
