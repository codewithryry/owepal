<template>
  <div
    class="dashboard-container min-vh-100 py-5 px-3"
    :class="darkMode ? 'dark-mode' : 'light-mode'"
  >
    <!-- Header Section with Budget Input -->
    <div class="header-section text-center mb-5 rounded-box">
      <h1 class="fw-bold display-4 animate__animated animate__fadeIn">
        ₱{{ budget.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
      </h1>
      <p class="text-muted fs-5">Your Budget</p>
      <div class="budget-input flex flex-col md:flex-row gap-2 mt-4 justify-center">
        <div class="flex w-full md:w-auto">
          <span class="flex items-center px-3 bg-gray-100 rounded-l-md dark:bg-gray-700 dark:text-gray-200">₱</span>
          <input
            type="number"
            v-model.number="budget"
            placeholder="Set your budget"
            class="flex-1 border-none rounded-r-md px-3 py-2 bg-white shadow-sm dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>
        <button
          @click="saveBudget"
          class="btn btn-primary"
        >
          Save Budget
        </button>
      </div>
      <div class="header-underline"></div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-box mb-5">
      <div class="summary-card">
        <div class="card modern-card h-100 rounded-box shadow-sm animate__animated animate__zoomIn">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2 text-muted">Total Expenses</h6>
              <h3 class="fw-bold text-teal-600">₱{{ totalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</h3>
              <p class="small text-muted mt-2">{{ expenses.length }} expenses recorded</p>
            </div>
            <div class="icon-circle bg-teal-50">
              <i class="bi bi-wallet fs-2 text-teal-600"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="summary-card">
        <div class="card modern-card h-100 rounded-box shadow-sm animate__animated animate__zoomIn">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2 text-muted">Remaining Budget</h6>
              <h3 class="fw-bold" :class="remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'">
                ₱{{ remainingBudget.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
              </h3>
              <p class="small text-muted mt-2">{{ remainingBudget >= 0 ? 'You\'re on track!' : 'Over budget!' }}</p>
            </div>
            <div class="icon-circle bg-green-50">
              <i class="bi bi-check-circle fs-2 text-green-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Input -->
    <div class="expense-input mb-5 rounded-box shadow-sm animate__animated animate__fadeInUp">
      <div class="card-header p-3 border-0">
        <h5 class="fw-bold mb-0">Add New Expense</h5>
      </div>
      <div class="card-body p-3">
        <div class="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            v-model="newExpense.name"
            placeholder="Expense name"
            class="flex-1 border-none rounded-md px-3 py-2 bg-white shadow-sm text-black placeholder-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <div class="flex">
            <span class="flex items-center px-3 bg-gray-100 rounded-l-md dark:bg-gray-700 dark:text-gray-200">₱</span>
            <input
              type="number"
              v-model.number="newExpense.amount"
              placeholder="Amount"
              class="w-full md:w-28 border-none rounded-r-md px-3 py-2 bg-white shadow-sm text-black placeholder-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <button
            @click="addExpense"
            class="btn btn-primary"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>

    <!-- Expense List -->
    <div class="row g-3 mb-5">
      <div class="col-12">
        <div class="animate__animated animate__fadeInUp">
          <div class="card-header d-flex justify-content-between align-items-center p-3 border-0">
            <h5 class="fw-bold mb-0">Expenses</h5>
            <span class="badge bg-primary text-white">{{ expenses.length }}</span>
          </div>
          <div class="card-body p-3 d-flex flex-column">
            <div v-if="expenses.length" class="audit-list">
              <div
                v-for="expense in expenses"
                :key="expense.id"
                class="audit-item d-flex justify-content-between align-items-center mb-2"
              >
                <div class="debt-details d-flex align-items-center">
                  <div class="timeline-dot"></div>
                  <div class="debt-content">
                    <h6 class="fw-semibold mb-1">{{ expense.name }}</h6>
                    <small class="text-muted">
                      Amount: ₱{{ expense.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
                    </small>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="amount-badge">₱{{ expense.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
                  <button
                    @click="removeExpense(expense.id)"
                    class="delete-btn text-red-500 hover:text-red-700"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <i class="bi bi-file-earmark-text text-primary fs-2 mb-2"></i>
              <p class="text-muted">No expenses added yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db, auth } from '../firebase/config' // Adjust path to your Firebase config
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { inject } from 'vue'

// Injected dark mode
const darkMode = inject('darkMode')

// Reactive variables
const budget = ref(0)
const expenses = ref([])
const newExpense = ref({ name: '', amount: 0 })
const userId = ref(null)

// Firestore collections
const budgetCollection = () => collection(db, `users/${userId.value}/budget`)
const expenseCollection = () => collection(db, `users/${userId.value}/expenses`)

// Computed totals
const totalExpenses = computed(() =>
  expenses.value.reduce((sum, expense) => sum + (expense.amount || 0), 0)
)
const remainingBudget = computed(() => budget.value - totalExpenses.value)

// Add new expense
async function addExpense() {
  if (!newExpense.value.name || newExpense.value.amount <= 0) return
  const docRef = await addDoc(expenseCollection(), {
    name: newExpense.value.name,
    amount: newExpense.value.amount,
  })
  expenses.value.push({ ...newExpense.value, id: docRef.id })
  newExpense.value.name = ''
  newExpense.value.amount = 0
}

// Remove expense
async function removeExpense(id) {
  await deleteDoc(doc(db, `users/${userId.value}/expenses`, id))
  expenses.value = expenses.value.filter(exp => exp.id !== id)
}

// Save budget
async function saveBudget() {
  const budgetDocRef = doc(db, `users/${userId.value}/budget`, 'main')
  await setDoc(budgetDocRef, { amount: budget.value })
}

// Load budget and expenses
async function loadData() {
  // Load budget
  const budgetDoc = await getDocs(budgetCollection())
  budgetDoc.forEach(doc => {
    if (doc.id === 'main') budget.value = doc.data().amount || 0
  })

  // Load expenses
  const expenseDocs = await getDocs(expenseCollection())
  expenses.value = expenseDocs.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Watch user auth
onMounted(() => {
  onAuthStateChanged(auth, user => {
    if (user) {
      userId.value = user.uid
      loadData()
    }
  })
})
</script>

<style scoped>
/* Base Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.dashboard-container {
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  background: transparent !important;
}

.dark-mode {
  color: #e5e7eb;
  background: transparent !important;
}

.light-mode {
  color: #111827;
  background: #f9fafb !important;
}

/* Rounded Box */
.rounded-box {
  border-radius: 1rem;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f9fafb);
}

.dark-mode .rounded-box {
  background: linear-gradient(145deg, #1f2937, #2d3748);
}

/* Header Section */
.header-section {
  padding: 2rem;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
}

.header-section h1 {
  font-size: 2.25rem;
  font-weight: 800;
}

.header-section p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.header-underline {
  width: 80px;
  height: 4px;
  background: #ffffff;
  margin: 0.75rem auto;
  border-radius: 2px;
  opacity: 0.8;
}

/* Summary Cards */
.summary-box {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  padding: 0;
}

.summary-card {
  width: 100%;
}

.modern-card {
  background: #ffffff;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 0.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.dark-mode .modern-card {
  background: #1f2937;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.modern-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.modern-card .card-body {
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.modern-card .card-subtitle {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #6b7280;
}

.dark-mode .modern-card .card-subtitle {
  color: #9ca3af;
}

.modern-card h3 {
  font-size: 1.25rem;
  line-height: 1.2;
  font-weight: 700;
}

.modern-card .small {
  font-size: 0.75rem;
  opacity: 0.8;
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
  transform: scale(1.1);
}

.bg-teal-50 {
  background: #e6fffa;
}

.bg-green-50 {
  background: #ecfdf5;
}

/* Input Styling */
.budget-input input,
.expense-input input {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  color: #111827; /* Explicit black text for light mode */
  caret-color: #111827; /* Visible cursor in light mode */
}

.budget-input input:focus,
.expense-input input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.budget-input input::placeholder,
.expense-input input::placeholder {
  color: #6b7280; /* Clear placeholder color in light mode */
}

.dark-mode .budget-input input,
.dark-mode .expense-input input {
  background: #2d3748;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: #e5e7eb; /* Light text for dark mode */
  caret-color: #e5e7eb; /* Visible cursor in dark mode */
}

.dark-mode .budget-input input::placeholder,
.dark-mode .expense-input input::placeholder {
  color: #9ca3af; /* Clear placeholder color in dark mode */
}

.dark-mode .budget-input input:focus,
.dark-mode .expense-input input:focus {
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

/* Audit Log List Styles */
.audit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.audit-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.dark-mode .audit-item {
  background: #2d3748;
  border: 1px solid #4b5563;
}

.audit-item:hover {
  background: #f1f5f9;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.dark-mode .audit-item:hover {
  background: #374151;
}

/* Timeline Dot */
.timeline-dot {
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  transition: background 0.3s ease;
}

.dark-mode .timeline-dot {
  background: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

/* Debt Details */
.debt-details {
  display: flex;
  align-items: center;
  flex: 1;
}

.debt-content {
  flex: 1;
}

.debt-details h6 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.debt-details small {
  font-size: 0.8rem;
  line-height: 1.5;
  color: #6b7280;
}

.dark-mode .debt-details small {
  color: #9ca3af;
}

/* Amount Badge */
.amount-badge {
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  white-space: nowrap;
  text-align: center;
  transition: background 0.3s ease;
}

.dark-mode .amount-badge {
  background: #60a5fa;
}

.amount-badge:hover {
  background: #2563eb;
}

.dark-mode .amount-badge:hover {
  background: #3b82f6;
}

/* Delete Button Styling */
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

.dark-mode .delete-btn:hover {
  background: #7f1d1d;
}

.delete-btn i {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .delete-btn {
    width: 1.75rem;
    height: 1.75rem;
  }
  .delete-btn i {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .delete-btn {
    width: 1.5rem;
    height: 1.5rem;
  }
  .delete-btn i {
    font-size: 0.875rem;
  }
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

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate__animated.animate__fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

.animate__animated.animate__zoomIn {
  animation: zoomIn 0.5s ease-out;
}

/* Desktop Adjustments */
@media (min-width: 992px) {
  .dashboard-container {
    padding: 3rem 4rem;
    max-width: 1280px;
    margin: 0 auto;
  }

  .header-section {
    padding: 2.5rem;
  }

  .header-section h1 {
    font-size: 3rem;
  }

  .summary-box {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .modern-card {
    padding: 0.75rem;
  }

  .modern-card h3 {
    font-size: 1.5rem;
  }

  .audit-list {
    gap: 1rem;
  }

  .audit-item {
    padding: 1rem 1.25rem;
    grid-template-columns: 4fr 1fr;
  }

  .debt-details h6 {
    font-size: 1.1rem;
  }

  .debt-details small {
    font-size: 0.9rem;
  }

  .timeline-dot {
    width: 14px;
    height: 14px;
    margin-right: 1.5rem;
  }

  .amount-badge {
    font-size: 0.9rem;
    padding: 0.5rem 1.25rem;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
  }

  .card-body {
    padding: 1.5rem !important;
  }

  .btn-primary {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .header-section {
    padding: 1.5rem;
  }

  .header-section h1 {
    font-size: 2rem;
  }

  .header-section p {
    font-size: 1rem;
  }

  .budget-input {
    gap: 1rem;
  }

  .summary-box {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0;
  }

  .modern-card {
    padding: 0.5rem;
  }

  .modern-card .card-body {
    padding: 1rem;
  }

  .modern-card .card-subtitle {
    font-size: 0.875rem;
  }

  .modern-card h3 {
    font-size: 1.25rem;
  }

  .modern-card .small {
    font-size: 0.75rem;
  }

  .icon-circle {
    width: 2.25rem;
    height: 2.25rem;
  }

  .audit-item {
    padding: 0.75rem;
    flex-direction: row;
    align-items: center;
  }

  .debt-details h6 {
    font-size: 0.95rem;
  }

  .debt-details small {
    font-size: 0.8rem;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    margin-right: 0.75rem;
  }

  .amount-badge {
    font-size: 0.8rem;
    padding: 0.3rem 0.75rem;
  }

  .btn-primary {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    width: 100%;
  }

  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem !important;
  }
}

/* Extra Small Screens */
@media (max-width: 480px) {
  .dashboard-container {
    padding: 0.75rem;
  }

  .header-section {
    padding: 1rem;
  }

  .header-section h1 {
    font-size: 1.75rem;
  }

  .header-section p {
    font-size: 0.875rem;
  }

  .budget-input {
    gap: 0.75rem;
  }

  .modern-card .card-body {
    padding: 0.75rem;
  }

  .modern-card h3 {
    font-size: 1.125rem;
  }

  .audit-item {
    padding: 0.5rem;
  }

  .debt-details h6 {
    font-size: 0.9rem;
  }

  .debt-details small {
    font-size: 0.75rem;
  }

  .amount-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .btn-primary {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}
</style>