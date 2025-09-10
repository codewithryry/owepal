<template>
  <div
    v-if="user"
    class="dashboard-container min-vh-100 py-5 px-3"
    :class="darkMode ? 'dark-mode' : 'light-mode'"
  >
    <!-- Header with Greeting and Time on Left
    <div class="header-left-section mb-3">
      <h3 class="fw-bold fs-4 mb-0 animate__animated animate__fadeIn">
        {{ greetingMessage }}, {{ user.displayName || 'User' }}!
      </h3>
      <br></br>
    </div> -->

    <!-- Total Debt Section -->
    <div class="header-section text-center mb-5 rounded-box">
      <h1 class="fw-bold display-4 animate__animated animate__fadeIn">
        ₱{{ totalDebt.toLocaleString() }}
      </h1>
      <p class="text-muted fs-5">Total Debt Balance</p>
      <div v-if="totalSanglaLoanAmount > 0" class="text-muted small mt-2">
        Total Sangla Loan Amount: ₱{{ totalSanglaLoanAmount.toLocaleString() }}
      </div>
      <div class="header-underline"></div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-box mb-5">
      <div v-for="card in summaryCards" :key="card.title" class="summary-card">
        <div class="card modern-card h-100 rounded-box shadow-sm animate__animated animate__zoomIn">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2 text-muted">{{ card.title }}</h6>
              <h3 class="fw-bold" :class="card.textClass">{{ card.value }}</h3>
              <p class="small text-muted mt-2">
                <span v-if="card.subtitle" :class="card.changeClass">{{ card.subtitle }}</span>
              </p>
            </div>
            <div :class="['icon-circle', card.bgClass]">
              <i :class="card.iconClass"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Section -->
    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="animate__animated animate__fadeInUp">
          <div class="card-header d-flex justify-content-between align-items-center p-4 border-0">
            <h5 class="fw-bold mb-0">Recent Transactions</h5>
            <span class="badge bg-primary text-white">{{ recentDebts.length }}</span>
          </div>
          <div class="card-body p-4 d-flex flex-column">
            <div v-if="recentDebts.length" class="audit-list">
              <div
                v-for="debt in recentDebts"
                :key="debt.id"
                class="audit-item d-flex justify-content-between align-items-center mb-3"
              >
                <div class="debt-details d-flex align-items-center">
                  <div class="timeline-dot"></div>
                  <div class="debt-content">
                    <h6 class="fw-semibold mb-1">{{ debt.debtSource }}</h6>
                    <small class="text-muted">
                      Amount: ₱{{ debt.amount.toLocaleString() }}<br />
                      Due: {{ formatDate(debt.dueDate) }}<br />
                      Status:
                      <span :class="debt.isPaid ? 'text-success' : 'text-warning'">{{
                        debt.isPaid ? 'Paid' : 'Unpaid'
                      }}</span>
                      <span v-if="debt.loanType"><br />Type: {{ debt.loanType }}</span>
                    </small>
                  </div>
                </div>
                <span class="amount-badge">₱{{ debt.amount.toLocaleString() }}</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="bi bi-file-earmark-text text-primary fs-1 mb-3"></i>
              <p class="text-muted">No recent activity.</p>
            </div>
            <div class="button-container mt-auto">
              <router-link to="/debts" class="btn btn-outline-primary"
                >View All Transactions</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Due Soon Section -->
    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="animate__animated animate__fadeInUp">
          <div class="card-header d-flex justify-content-between align-items-center p-4 border-0">
            <h5 class="fw-bold mb-0">Due Soon</h5>
            <span class="badge bg-primary text-white">{{ dueSoonDebts.length }}</span>
          </div>
          <div class="card-body p-4 d-flex flex-column">
            <div v-if="dueSoonDebts.length" class="audit-list">
              <div
                v-for="debt in dueSoonDebts"
                :key="debt.id"
                class="audit-item d-flex justify-content-between align-items-center mb-3"
              >
                <div class="debt-details d-flex align-items-center">
                  <div class="timeline-dot"></div>
                  <div class="debt-content">
                    <h6 class="fw-semibold mb-1">{{ debt.debtSource }}</h6>
                    <small class="text-muted">
                      Due: {{ formatDate(debt.renewalDate) }}<br />
                      Amount: ₱{{ debt.amount.toLocaleString() }}
                      <span v-if="debt.loanType === 'Sangla' && debt.loanAmount">
                        <br />Loan Amount: ₱{{ debt.loanAmount.toLocaleString() }}
                      </span>
                    </small>
                  </div>
                </div>
                <span class="amount-badge">₱{{ debt.amount.toLocaleString() }}</span>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="bi bi-check-circle text-success fs-1 mb-3"></i>
              <p class="text-muted">No debts due soon. You're on track!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'

const user = inject('user')
const darkMode = inject('darkMode')
const debts = ref([])

// Fetch debts from Firebase
onMounted(() => {
  if (user.value) {
    const debtsQuery = query(
      collection(db, 'debts'),
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc'),
    )
    onSnapshot(debtsQuery, (snapshot) => {
      debts.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Default void to false for backward compatibility
        void: doc.data().void || false
      }))
    })

    // Start updating time
    updateTime()
    setInterval(updateTime, 1000) // Update every second
  }
})

// Time and Greeting Logic
const currentTime = ref('')
const greetingMessage = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  })

  const hour = now.getHours()
  if (hour < 12) {
    greetingMessage.value = 'Good Morning'
  } else if (hour < 18) {
    greetingMessage.value = 'Good Afternoon'
  } else {
    greetingMessage.value = 'Good Evening'
  }
}

// Calculate totals, excluding voided debts
const totalDebt = computed(() =>
  debts.value
    .filter((d) => !d.void)
    .reduce((sum, d) => sum + (d.amount || 0), 0)
)

const totalSanglaLoanAmount = computed(() =>
  debts.value
    .filter((d) => !d.void && d.loanType === 'Sangla')
    .reduce((sum, d) => sum + (d.loanAmount || 0), 0)
)

const activeDebts = computed(() =>
  debts.value.filter((d) => !d.void && !d.isPaid).length
)

const paidDebts = computed(() =>
  debts.value.filter((d) => d.void).length // Count voided debts as paid
)

const monthlyPayment = computed(() =>
  debts.value
    .filter((d) => !d.void)
    .reduce((sum, d) => sum + (d.amount || 0) / 12, 0)
)

const installments = computed(() =>
  debts.value.filter((d) => !d.void && d.amount > 0).length
)

// Recent debts (last 3 non-voided entries)
const recentDebts = computed(() =>
  debts.value
    .filter((d) => !d.void && d.userId === user.value?.uid)
    .slice(0, 3)
)

// Due soon debts, excluding voided debts
const isDueSoon = (dateStr, loanType) => {
  if (!dateStr) return false
  const today = new Date()
  const targetDate = new Date(dateStr)
  const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays >= 0
}

const dueSoonDebts = computed(() =>
  debts.value.filter(
    (d) =>
      !d.void &&
      !d.isPaid &&
      ((d.renewalDate && d.loanType === 'Sangla' && isDueSoon(d.renewalDate, d.loanType)) ||
       (d.dueDate && ['Splaylater', 'Gloan', 'Gredit'].includes(d.loanType) && isDueSoon(d.dueDate, d.loanType)))
  )
)

// Format date
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'

// Summary cards config
const summaryCards = computed(() => [
  {
    title: 'Monthly Payment',
    value: `₱${monthlyPayment.value.toLocaleString()}`,
    subtitle: `${installments.value} installments ongoing`,
    textClass: 'text-teal-600',
    changeClass: 'text-gray-500 small',
    iconClass: 'bi bi-calendar-check fs-3 text-teal-600',
    bgClass: 'bg-teal-50',
  },
  {
    title: 'Active Debts',
    value: activeDebts.value,
    subtitle: `${paidDebts.value} debts paid recently`,
    textClass: 'text-blue-600',
    changeClass: 'text-gray-500 small',
    iconClass: 'bi bi-file-earmark-text fs-3 text-blue-600',
    bgClass: 'bg-blue-50',
  },
  {
    title: 'Already Paid',
    value: paidDebts.value,
    subtitle: `Total paid debts`,
    textClass: 'text-green-600',
    changeClass: 'text-green-600 small',
    iconClass: 'bi bi-check-circle fs-3 text-green-600',
    bgClass: 'bg-green-50',
  },
  {
    title: 'Sangla Loans',
    value: `₱${totalSanglaLoanAmount.value.toLocaleString()}`,
    subtitle: 'Total collateral loan value',
    textClass: 'text-purple-600',
    changeClass: 'text-gray-500 small',
    iconClass: 'bi bi-piggy-bank fs-3 text-purple-600',
    bgClass: 'bg-purple-50',
  },
])

</script>

<style scoped>
/* Base Styles */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Apply Poppins to all elements within the dashboard container */
.dashboard-container,
.dashboard-container * {
  font-family: 'Poppins', sans-serif !important;
  transition: all 0.3s ease;
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
  border-radius: 1.5rem;
  overflow: hidden;
}

/* Header Left Section */
.header-left-section {
  text-align: left;
  padding: 0;
  margin-bottom: 1rem;
}

.header-left-section h3 {
  margin-bottom: 0.25rem;
}

.header-left-section p {
  margin-bottom: 0;
}

/* Total Debt Header Section */
.header-section {
  margin-top: -2rem;
  padding: 2rem;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dark-mode .header-section {
  background: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  margin: 0.75rem auto;
  border-radius: 2px;
}

.dark-mode .header-underline {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

/* Summary Cards */
.summary-box {
  margin-top: -1.8rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 0 0.5rem;
}

.summary-card {
  width: 100%;
}

.modern-card {
  background: #ffffff;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 0.75rem;
}

.dark-mode .modern-card {
  background: #1f2937;
  border: none;
}

.modern-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.modern-card .card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.modern-card .card-subtitle {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.modern-card h3 {
  font-size: 1.25rem;
  line-height: 1.2;
}

.modern-card .small {
  font-size: 0.75rem;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.icon-circle:hover {
  transform: scale(1.05);
}

.bg-blue-50 {
  background: #eff6ff;
}
.bg-green-50 {
  background: #f0fdf4;
}
.bg-teal-50 {
  background: #f0fdfa;
}
.bg-purple-50 {
  background: #faf5ff;
}

/* Audit Log List Styles */
.audit-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.audit-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  display: grid;
  grid-template-columns: 4fr 1fr;
  align-items: center;
}

.dark-mode .audit-item {
  background: #2d3748;
  border: 1px solid #4b5563;
}

.audit-item:hover {
  background: #f1f5f9;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.dark-mode .audit-item:hover {
  background: #374151;
}

/* Timeline Dot for Audit Log Style */
.timeline-dot {
  width: 12px;
  height: 12px;
  background: #1d4ed8;
  border-radius: 50%;
  margin-right: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.15);
  transition: background 0.3s ease;
}

.dark-mode .timeline-dot {
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
}

/* Debt Details */
.debt-details {
  display: flex;
  align-items: center;
}

.debt-content {
  flex: 1;
}

.debt-details h6 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.debt-details small {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #6b7280;
}

.dark-mode .debt-details small {
  color: #9ca3af;
}

/* Amount Badge */
.amount-badge {
  background: #1d4ed8;
  color: #fff;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  white-space: nowrap;
  text-align: center;
  transition: background 0.3s ease;
}

.dark-mode .amount-badge {
  background: #3b82f6;
}

.amount-badge:hover {
  background: #1e40af;
}

.dark-mode .amount-badge:hover {
  background: #2563eb;
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
}

/* Button Styling */
.btn-outline-primary {
  border: 2px solid #1d4ed8;
  color: #1d4ed8;
  padding: 0.75rem 2.5rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  background: transparent;
}

.btn-outline-primary:hover {
  background: #1d4ed8;
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.3);
}

.dark-mode .btn-outline-primary {
  border-color: #3b82f6;
  color: #3b82f6;
}

.dark-mode .btn-outline-primary:hover {
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

/* Pull the Due Soon section up */
.row.g-4.mb-5 {
  margin-top: -3rem !important; /* closer to the section above */
  margin-bottom: 2rem !important; /* reduce spacing below */
}

.card-header {
  padding-top: 1rem !important; /* reduce header top padding */
  padding-bottom: 1rem !important;
}


/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate__animated.animate__fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

.animate__animated.animate__zoomIn {
  animation: zoomIn 0.6s ease-out;
}

/* Desktop Adjustments */
@media (min-width: 992px) {
  .dashboard-container {
    padding: 2rem 3rem;
  }
  
  .header-left-section {
    margin-bottom: 1.5rem;
  }
  
  .header-left-section h3 {
    font-size: 1.5rem;
  }
  
  .header-left-section p {
    font-size: 1rem;
  }
  
  .header-section {
    padding: 3rem;
  }
  .header-section h1 {
    font-size: 3rem;
  }
  .summary-box {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  .modern-card {
    padding: 1rem;
  }
  .audit-list {
    gap: 1.25rem;
  }
  .audit-item {
    padding: 1.75rem;
    grid-template-columns: 4fr 1fr;
  }
  .debt-details h6 {
    font-size: 1.3rem;
  }
  .debt-details small {
    font-size: 1rem;
  }
  .timeline-dot {
    width: 16px;
    height: 16px;
    margin-right: 2rem;
  }
  .amount-badge {
    font-size: 1.1rem;
    padding: 0.75rem 1.75rem;
  }
  .card-header {
    padding: 1.75rem 2.5rem;
  }
  .card-body {
    padding: 2.5rem !important;
  }
  .btn-outline-primary {
    padding: 0.85rem 3rem;
    font-size: 1.15rem;
  }
  .button-container {
    padding-top: 2.5rem;
  }
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .header-left-section {
    margin-bottom: 0.75rem;
    text-align: left;
  }
  
  .header-left-section h3 {
    font-size: 1.25rem;
  }
  
  .header-left-section p {
    font-size: 0.875rem;
  }
  
  .header-section {
    padding: 1.5rem;
  }
  .header-section h1 {
    font-size: 1.75rem;
  }
  .summary-box {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0 0.25rem;
  }
  .modern-card {
    padding: 0.5rem;
  }
  .modern-card .card-body {
    padding: 0.75rem;
  }
  .modern-card .card-subtitle {
    font-size: 0.75rem;
  }
  .modern-card h3 {
    font-size: 1rem;
  }
  .modern-card .small {
    font-size: 0.625rem;
  }
  .icon-circle {
    width: 2rem;
    height: 2rem;
  }
  .audit-item {
    flex-direction: row;
    align-items: center;
    padding: 0.75rem;
    display: flex;
  }
  .debt-details {
    flex-direction: row;
    align-items: center;
  }
  .debt-details h6 {
    font-size: 0.9rem;
  }
  .debt-details small {
    font-size: 0.75rem;
  }
  .timeline-dot {
    width: 10px;
    height: 10px;
    margin-right: 0.75rem;
  }
  .amount-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  .btn-outline-primary {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  .button-container {
    padding-top: 1rem;
  }
}
</style>