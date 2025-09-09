<template>
  <div class="page-container">
    <h1>Backup to Cloud</h1>
    <button @click="backup" :disabled="loading">Backup Now</button>
    <p v-if="status">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const status = ref('')
const loading = ref(false)
const rows = ref([])

async function fetchUserData() {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    status.value = 'User not logged in.'
    return
  }

  const db = getFirestore()
  const q = query(collection(db, 'debts'), where('userId', '==', user.uid))
  const querySnapshot = await getDocs(q)
  rows.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

async function backup() {
  if (!rows.value.length) {
    status.value = 'No data to backup.'
    return
  }

  loading.value = true
  status.value = 'Backing up...'

  try {
    const db = getFirestore()
    const auth = getAuth()
    const user = auth.currentUser
    const backupCollection = collection(db, 'backups')

    // Save each row as a backup
    for (const row of rows.value) {
      await addDoc(backupCollection, {
        ...row,
        backupDate: new Date(),
        userId: user.uid
      })
    }

    status.value = 'Backup complete!'
  } catch (err) {
    console.error(err)
    status.value = 'Backup failed. Check console.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUserData)
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style>
