<template>
  <div class="container py-5">
    <!-- No Reminders -->
    <div v-if="!reminders.length" class="glass-card alert alert-success text-center py-5">
      You’re all caught up! No upcoming or overdue debts.
    </div>

    <!-- Reminder List -->
    <ul v-else class="list-group">
      <li
        v-for="reminder in reminders"
        :key="reminder.id"
        class="list-group-item glass-card d-flex justify-content-between align-items-center mb-2"
        :class="{
          'reminder-dueSoon': reminder.type === 'dueSoon',
          'reminder-overdue': reminder.type === 'overdue',
        }"
      >
        <div>
          <h6 class="mb-1">{{ reminder.debtSource }}</h6>
          <small>
            Amount: ₱{{ reminder.amount.toLocaleString() }} <br />
            Status:
            <span v-if="reminder.type === 'overdue'" class="text-danger fw-bold">Overdue</span>
            <span v-else class="text-warning">Due Soon</span>
          </small>
        </div>
        <div>
          <span class="badge bg-light text-dark">
            Renewal: {{ formatDate(reminder.renewalDate) }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

const user = inject('user')
const debts = ref([])

onMounted(() => {
  if (user.value) {
    const q = query(collection(db, 'debts'), where('userId', '==', user.value.uid))
    onSnapshot(q, (snapshot) => {
      debts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    })
  }
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isDueSoon(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  const renewal = new Date(dateStr)
  const diffDays = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays >= 0
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  const renewal = new Date(dateStr)
  return renewal < today
}

const reminders = computed(() =>
  debts.value
    .filter((d) => !d.isPaid && d.renewalDate)
    .map((d) => {
      if (isOverdue(d.renewalDate)) return { ...d, type: 'overdue' }
      if (isDueSoon(d.renewalDate)) return { ...d, type: 'dueSoon' }
      return null
    })
    .filter((r) => r !== null),
)
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  padding: 1rem;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.reminder-dueSoon {
  border-left: 4px solid #ffc107;
}

.reminder-overdue {
  border-left: 4px solid #dc3545;
}
</style>
