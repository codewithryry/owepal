<template>
  <div
    class="page-container py-5 px-3"
    :class="darkMode ? 'dark-mode' : 'light-mode'"
  >
    <!-- Table Preview -->
    <div class="data-table-container rounded-box shadow-sm animate__animated animate__fadeInUp">
      <div class="card-header p-3 border-0">
        <h5 class="fw-bold mb-0">Debt Records</h5>
      </div>
      <div class="card-body p-3">
        <div v-if="rows.length" class="data-table">
          <div class="table-header d-none d-lg-flex">
            <div class="table-cell">Amount</div>
            <div class="table-cell">Created At</div>
            <div class="table-cell">Debt Source</div>
            <div class="table-cell">Due Date</div>
            <div class="table-cell">Is Paid?</div>
            <div class="table-cell">Item</div>
            <div class="table-cell">Loan Amount</div>
            <div class="table-cell">Loan Type</div>
            <div class="table-cell">Renewal Date</div>
            <div class="table-cell">Transaction Picture</div>
          </div>
          <div v-for="row in rows" :key="row.id" class="table-row rounded-box shadow-sm">
            <div class="table-cell">
              <span class="field-label d-lg-none">Amount:</span>
              ₱{{ row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Created At:</span>
              {{ row.createdAt || '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Debt Source:</span>
              {{ row.debtSource || '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Due Date:</span>
              {{ row.dueDate || '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Is Paid?:</span>
              {{ row.isPaid ? 'Yes' : 'No' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Item:</span>
              {{ row.item || '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Loan Amount:</span>
              {{ row.loanAmount ? '₱' + row.loanAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Loan Type:</span>
              {{ row.loanType || '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Renewal Date:</span>
              {{ row.renewalDate || '-' }}
            </div>
            <div class="table-cell">
              <span class="field-label d-lg-none">Transaction Picture:</span>
              {{ row.transactionPicture || '-' }}
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <i class="bi bi-file-earmark-text text-primary fs-2 mb-2"></i>
          <p class="text-muted">No debt records found.</p>
        </div>
      </div>
    </div>

    <!-- Download Button -->
    <button
      @click="exportCsv"
      :disabled="!rows.length"
      class="btn btn-primary mt-4"
    >
      Download CSV
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { inject } from 'vue'

// Injected dark mode
const darkMode = inject('darkMode')

const rows = ref([])

async function fetchUserData() {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return

  const db = getFirestore()
  const q = query(collection(db, 'debts'), where('userId', '==', user.uid))
  const querySnapshot = await getDocs(q)
  rows.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

function exportCsv() {
  if (!rows.value.length) return

  // Define CSV headers
  const headers = [
    'amount',
    'createdAt',
    'debtSource',
    'dueDate',
    'isPaid',
    'item',
    'loanAmount',
    'loanType',
    'renewalDate',
    'transactionPicture'
  ]

  // Format CSV rows, ensuring proper escaping of values
  const csv = [
    headers.join(','), // Header row
    ...rows.value.map(row =>
      headers.map(h => {
        const value = row[h] ?? ''
        return JSON.stringify(value) // Escape commas, quotes, etc.
      }).join(',')
    )
  ].join('\n')

  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `debt-export-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(fetchUserData)
</script>

<style scoped>
/* Base Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.page-container {
  margin-top: -2rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  background: transparent !important;
}

.dark-mode {
  color: #e5e7eb;
  background: transparent !important;
}

.light-mode {
  color: #111827;
  background: transparent !important;
}

/* Rounded Box */
.rounded-box {
  border-radius: 1rem;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
}

.dark-mode .rounded-box {
  background: linear-gradient(145deg, #1f2937, #2d3748);
}

/* Table Styles */
.data-table-container {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.dark-mode .data-table-container {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.data-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.table-header {
  display: flex;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.dark-mode .table-header {
  background: #2d3748;
  border-bottom: 1px solid #4b5563;
}

.table-row {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dark-mode .table-row {
  border: 1px solid #4b5563;
}

.table-row:hover {
  background: #f1f5f9;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.dark-mode .table-row:hover {
  background: #374151;
}

.table-cell {
  padding: 0.5rem;
  font-size: 0.85rem;
  color: #111827;
}

.dark-mode .table-cell {
  color: #e5e7eb;
}

.field-label {
  font-weight: 600;
  color: #6b7280;
  margin-right: 0.5rem;
}

.dark-mode .field-label {
  color: #9ca3af;
}

/* Button Styling */
.btn-primary {
  border: none;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  touch-action: manipulation;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: scale(1.05);
}

.btn-primary:disabled {
  background: #999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.dark-mode .btn-primary {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.dark-mode .btn-primary:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate__animated.animate__fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

/* Desktop Adjustments */
@media (min-width: 992px) {
  .page-container {
    padding: 3rem 4rem;
    max-width: 1280px;
    margin: 0 auto;
  }

  .data-table {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }

  .table-header {
    display: table-row;
  }

  .table-row {
    display: table-row;
    flex-direction: row;
    border: none;
  }

  .table-cell {
    display: table-cell;
    padding: 0.75rem;
    font-size: 0.9rem;
    border: 1px solid #e5e7eb;
  }

  .dark-mode .table-cell {
    border: 1px solid #4b5563;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .btn-primary {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .table-row {
    padding: 0.5rem;
  }

  .table-cell {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.25rem;
    font-size: 0.85rem;
  }

  .btn-primary {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    width: 100%;
  }
}

/* Extra Small Screens */
@media (max-width: 480px) {
  .page-container {
    padding: 0.75rem;
  }

  .card-header {
    padding: 0.75rem;
  }

  .card-body {
    padding: 0.75rem;
  }

  .table-cell {
    font-size: 0.8rem;
  }

  .btn-primary {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}
</style>