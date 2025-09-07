<template>
  <div class="container py-5">
    <h2 class="mb-4">Debug Information</h2>

    <div class="row gy-4">
      <!-- User Info -->
      <div class="col-12 col-md-6">
        <h5>User Info</h5>
        <div v-if="userLoading" class="text-muted">Loading user data...</div>
        <div v-else-if="user">
          <pre class="bg-light p-3 rounded small text-dark">{{ pretty(userDebug) }}</pre>
        </div>
        <div v-else class="text-muted">No user logged in</div>
      </div>

      <!-- Current Form Data -->
      <div class="col-12 col-md-6">
        <h5>Current Form Data</h5>
        <pre class="bg-light p-3 rounded small text-dark">{{ pretty(formDebug) }}</pre>
      </div>

      <!-- Debts -->
      <div class="col-12">
        <h5>All Debts ({{ debts.length }})</h5>
        <div v-if="debtsLoading" class="text-muted">Loading debts...</div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Type</th>
                <th>UserID</th>
                <th>Paid</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in debts" :key="d.id">
                <td class="small">{{ d.id.slice(0, 8) }}...</td>
                <td>{{ d.debtSource }}</td>
                <td>₱{{ formatNumber(d.amount) }}</td>
                <td>{{ d.loanType }}</td>
                <td class="small">
                  {{ d.userId ? d.userId.slice(0, 8) + '...' : 'MISSING' }}
                </td>
                <td>{{ d.isPaid ? 'Yes' : 'No' }}</td>
                <td class="small">{{ formatDateSafe(d.createdAt) }}</td>
              </tr>
              <tr v-if="!debts.length">
                <td colspan="7" class="text-center small text-muted">No debts recorded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Audit Logs -->
      <div class="col-12">
        <h5>Audit Logs ({{ auditLogs.length }})</h5>
        <div v-if="auditLogsLoading" class="text-muted">Loading audit logs...</div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-striped">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Details</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in auditLogs" :key="log.id">
                <td class="small">{{ formatDateSafe(log.timestamp) }}</td>
                <td>{{ log.action }}</td>
                <td class="small">{{ log.details }}</td>
                <td class="small">
                  {{ log.userId ? log.userId.slice(0, 8) + '...' : 'N/A' }}
                </td>
              </tr>
              <tr v-if="!auditLogs.length">
                <td colspan="4" class="text-center small text-muted">No logs recorded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot, query, orderBy, where as firestoreWhere } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase/config'

// ---------------- state ----------------
const user = ref(null)
const userLoading = ref(true)
const debts = ref([])
const auditLogs = ref([])
const debtsLoading = ref(false)
const auditLogsLoading = ref(false)

let debtsUnsub = null
let logsUnsub = null

// ---------------- helpers ----------------
const pretty = (obj) => JSON.stringify(obj, null, 2)
const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : n)

const formatDateSafe = (v) => {
  if (!v) return 'N/A'
  try {
    if (typeof v.toDate === 'function') {
      return v
        .toDate()
        .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    if (typeof v === 'string') {
      const d = new Date(v)
      if (!isNaN(d)) {
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }
    }
    if (v instanceof Date) {
      return v.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  } catch {}
  return String(v)
}

const userDebug = computed(() => {
  if (!user.value) return null
  return {
    uid: user.value.uid,
    displayName: user.value.displayName || null,
    email: user.value.email || null,
    photoURL: user.value.photoURL || null,
  }
})

// Placeholder for form debug (if needed in global state)
const formDebug = computed(() => ({
  debtSource: '',
  item: '',
  amount: 0,
  renewalDate: '',
  loanType: '',
  isPaid: false,
  transactionPicture: null,
}))

// ---------------- Firestore listeners ----------------
const loadUserDebts = (userId) => {
  if (typeof debtsUnsub === 'function') debtsUnsub()
  debtsLoading.value = true
  const debtsQuery = query(
    collection(db, 'debts'),
    firestoreWhere('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  debtsUnsub = onSnapshot(debtsQuery, (snapshot) => {
    debts.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    debtsLoading.value = false
  })
}

const loadAuditLogs = (userId) => {
  if (typeof logsUnsub === 'function') logsUnsub()
  auditLogsLoading.value = true
  const logsQuery = query(
    collection(db, 'auditLogs'),
    firestoreWhere('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  )
  logsUnsub = onSnapshot(logsQuery, (snapshot) => {
    auditLogs.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    auditLogsLoading.value = false
  })
}

// ---------------- Auth ----------------
onMounted(() => {
  const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    userLoading.value = false
    if (firebaseUser) {
      loadUserDebts(firebaseUser.uid)
      loadAuditLogs(firebaseUser.uid)
    } else {
      debts.value = []
      auditLogs.value = []
    }
  })

  onUnmounted(() => {
    unsubAuth()
    if (typeof debtsUnsub === 'function') debtsUnsub()
    if (typeof logsUnsub === 'function') logsUnsub()
  })
})
</script>

