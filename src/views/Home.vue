<template>
  <div
    v-if="user"
    class="dashboard-container min-vh-100 py-5 px-3 slide-in-bottom"
    :class="darkMode ? 'dark-mode' : 'light-mode'"
  >
    <!-- Total Debt Section -->
    <div class="header-section text-center mb-5 rounded-box glass pulse-glow">
      <h1 class="fw-bold display-4 slide-in-bottom gradient-text">
        ₱{{ totalDebt.toLocaleString() }}
      </h1>
      <p class="text-muted fs-5 slide-in-bottom stagger-1">Total Debt Balance</p>
      <div v-if="totalSanglaLoanAmount > 0" class="text-muted small mt-2 slide-in-bottom stagger-2">
        Total Sangla Loan Amount: ₱{{ totalSanglaLoanAmount.toLocaleString() }}
      </div>
      <div class="header-underline slide-in-bottom stagger-3"></div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-box mb-5">
      <div v-for="(card, index) in summaryCards" :key="card.title" class="summary-card">
        <div class="card modern-card h-100 rounded-box shadow-sm glass float-animation" :class="`stagger-${index + 1}`">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2 text-muted">{{ card.title }}</h6>
              <h3 class="fw-bold" :class="card.textClass">{{ card.value }}</h3>
              <p class="small text-muted mt-2">
                <span v-if="card.subtitle" :class="card.changeClass">{{ card.subtitle }}</span>
              </p>
            </div>
            <div :class="['icon-circle', card.bgClass, 'pulse-glow']">
              <i :class="card.iconClass"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Section -->
    <div class="row g-4 mb-5">
      <div class="col-12">
        <div class="glass rounded-box slide-in-left">
          <div class="card-header d-flex justify-content-between align-items-center p-4 border-0 slide-in-bottom">
            <h5 class="fw-bold mb-0 gradient-text">Recent Transactions</h5>
            <span class="badge gradient-badge text-white pulse-glow">{{ recentDebts.length }}</span>
          </div>
          <div class="card-body p-4 d-flex flex-column">
            <div v-if="recentDebts.length" class="audit-list">
              <div
                v-for="(debt, index) in recentDebts"
                :key="debt.id"
                class="audit-item d-flex justify-content-between align-items-center mb-3 glass slide-in-right"
                :class="`stagger-${index + 1}`"
              >
                <div class="debt-details d-flex align-items-center">
                  <div class="timeline-dot pulse-glow"></div>
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
                <span class="amount-badge gradient-badge">₱{{ debt.amount.toLocaleString() }}</span>
              </div>
            </div>
            <div v-else class="text-center py-5 slide-in-bottom">
              <i class="bi bi-file-earmark-text text-primary fs-1 mb-3"></i>
              <p class="text-muted">No recent activity.</p>
            </div>
            <div class="button-container mt-auto slide-in-bottom stagger-4">
              <router-link to="/debts" class="btn btn-primary gradient-btn"
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
        <div class="glass rounded-box slide-in-right">
          <div class="card-header d-flex justify-content-between align-items-center p-4 border-0 slide-in-bottom">
            <h5 class="fw-bold mb-0 gradient-text">Due Soon</h5>
            <span class="badge gradient-badge text-white pulse-glow">{{ dueSoonDebts.length }}</span>
          </div>
          <div class="card-body p-4 d-flex flex-column">
            <div v-if="dueSoonDebts.length" class="audit-list">
              <div
                v-for="(debt, index) in dueSoonDebts"
                :key="debt.id"
                class="audit-item d-flex justify-content-between align-items-center mb-3 glass slide-in-left"
                :class="`stagger-${index + 1}`"
              >
                <div class="debt-details d-flex align-items-center">
                  <div class="timeline-dot pulse-glow"></div>
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
                <span class="amount-badge gradient-badge">₱{{ debt.amount.toLocaleString() }}</span>
              </div>
            </div>
            <div v-else class="text-center py-5 slide-in-bottom">
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

.dashboard-container {
  position: relative;
}

.dashboard-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(245, 87, 108, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

.dark-mode {
  color: #e5e7eb;
  background: transparent !important;
}

.light-mode {
  color: #111827;
  background: transparent !important;
}

/* Gradient Text */
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Gradient Badges */
.gradient-badge {
  background: var(--primary-gradient) !important;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Gradient Buttons */
.gradient-btn {
  background: var(--primary-gradient) !important;
  border: none;
  color: white !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: var(--transition-smooth);
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

/* Rounded Box */
.rounded-box {
  border-radius: 1.5rem;
  overflow: hidden;
}

/* Total Debt Header Section */
.header-section {
  margin-top: -2rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.header-underline {
  width: 80px;
  height: 4px;
  background: var(--primary-gradient);
  margin: 0.75rem auto;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
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
  border: none;
  transition: var(--transition-smooth);
  padding: 0.75rem;
  position: relative;
  overflow: hidden;
}

.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.8s ease;
}

.modern-card:hover {
  transform: translateY(-5px) scale(1.02);
}

.modern-card:hover::before {
  left: 100%;
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
  transition: var(--transition-smooth);
}

.icon-circle:hover {
  transform: scale(1.1) rotate(5deg);
}

.bg-blue-50 {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}
.bg-green-50 {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}
.bg-teal-50 {
  background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
}
.bg-purple-50 {
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
}

/* Audit Log List Styles */
.audit-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.audit-item {
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  transition: var(--transition-smooth);
  position: relative;
  display: grid;
  grid-template-columns: 4fr 1fr;
  align-items: center;
  overflow: hidden;
}

.audit-item:hover {
  transform: translateY(-3px) scale(1.02);
}

/* Timeline Dot for Audit Log Style */
.timeline-dot {
  width: 12px;
  height: 12px;
  background: var(--primary-gradient);
  border-radius: 50%;
  margin-right: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  transition: var(--transition-smooth);
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
  color: #fff;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  white-space: nowrap;
  text-align: center;
  transition: var(--transition-smooth);
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
}

/* Pull the Due Soon section up */
.row.g-4.mb-5 {
  margin-top: -3rem !important; /* closer to the section above */
  margin-bottom: 2rem !important; /* reduce spacing below */
}

.card-header {
  padding-top: 1rem !important; /* reduce header top padding */
  padding-bottom: 1rem !important;
  border-bottom: 1px solid var(--glass-border) !important;
}

/* Desktop Adjustments */
@media (min-width: 992px) {
  .dashboard-container {
    padding: 2rem 3rem;
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
  .gradient-btn {
    padding: 0.85rem 3rem;
    font-size: 1.15rem;
  }
  .button-container {
    padding-top: 2.5rem;
  }
}

/* Mobile Adjustments */
@media (max-width: 768px) {
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
  .gradient-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  .button-container {
    padding-top: 1rem;
  }
}
</style>