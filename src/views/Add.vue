<template>
  <div class="card glass-card shadow-sm mb-4 slide-in-bottom float-animation">
    <div class="card-body">
      <form @submit.prevent="addDebt" class="needs-validation" novalidate>
        <!-- Debt Source -->
        <div class="mb-3 slide-in-left stagger-1">
          <label for="debtSource" class="form-label">Where is the debt?</label>
          <input
            v-model="debtSource"
            type="text"
            class="form-control glass-input"
            id="debtSource"
            placeholder="e.g., Palawan Pawnshop"
            required
          />
        </div>

        <!-- Item for Sangla -->
        <div v-if="loanType === 'Sangla'" class="mb-3 slide-in-left stagger-2">
          <label for="item" class="form-label">What was pawned?</label>
          <input
            v-model="item"
            type="text"
            class="form-control glass-input"
            id="item"
            placeholder="e.g., Gold Ring"
            required
          />
        </div>

        <!-- Loan Amount for Sangla -->
        <div v-if="loanType === 'Sangla'" class="mb-3 slide-in-left stagger-3">
          <label for="loanAmount" class="form-label">Loan Amount (₱)</label>
          <input
            v-model.number="loanAmount"
            type="number"
            class="form-control glass-input"
            id="loanAmount"
            placeholder="0"
            required
            min="0"
          />
        </div>

        <!-- Amount -->
        <div class="mb-3 slide-in-left stagger-4">
          <label for="amount" class="form-label">Amount (₱)</label>
          <input
            v-model.number="amount"
            type="number"
            class="form-control glass-input"
            id="amount"
            placeholder="0"
            required
            min="0"
          />
        </div>

        <!-- Renewal Date for Sangla -->
        <div v-if="loanType === 'Sangla'" class="mb-3 slide-in-right stagger-1">
          <label for="renewalDate" class="form-label">Renewal Date</label>
          <input
            v-model="renewalDate"
            type="date"
            class="form-control glass-input"
            id="renewalDate"
            required
          />
        </div>

        <!-- Due Date for Splaylater, Gloan, and Gcredit -->
        <div v-if="['Splaylater', 'Gloan', 'Gcredit'].includes(loanType)" class="mb-3 slide-in-right stagger-2">
          <label for="dueDate" class="form-label">Due Date</label>
          <input
            v-model="dueDate"
            type="date"
            class="form-control glass-input"
            id="dueDate"
            required
          />
        </div>

        <!-- Loan Type -->
        <div class="mb-3 slide-in-right stagger-3">
          <label for="loanType" class="form-label">Loan Type</label>
          <select v-model="loanType" class="form-select glass-input" id="loanType" required>
            <option value="" disabled>Select Loan Type</option>
            <option value="Sangla">Sangla (Pawn)</option>
            <option value="Gloan">Gloan</option>
            <option value="Gcredit">Gcredit</option>
            <option value="Splaylater">Splaylater (Installment)</option>
          </select>
        </div>

        <!-- Mark as Paid -->
        <div class="mb-3 form-check slide-in-bottom stagger-1">
          <input v-model="isPaid" type="checkbox" class="form-check-input" id="isPaid" />
          <label class="form-check-label" for="isPaid">Mark as Paid</label>
        </div>

        <button type="submit" class="btn btn-primary w-100 gradient-btn pulse-glow slide-in-bottom stagger-2">
          Save Debt
        </button>
      </form>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="messageModal"
    tabindex="-1"
    aria-labelledby="messageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content glass-card slide-in-bottom">
        <div class="modal-header" :class="modalTypeClass">
          <h5 class="modal-title" id="messageModalLabel">{{ modalTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ modalMessage }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary gradient-btn" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const user = inject('user')

// Reactive fields
const debtSource = ref('')
const item = ref('')
const loanAmount = ref(0) // Sangla loan amount
const amount = ref(0)
const renewalDate = ref('')
const dueDate = ref('')
const loanType = ref('')
const isPaid = ref(false)
const transactionPicture = ref(null)

// Modal state
const modalMessage = ref('')
const modalType = ref('success')
const modalTitle = ref('')
const modalTypeClass = ref('bg-success text-white')

const handleFileUpload = (event) => {
  transactionPicture.value = event.target.files[0]
}

const showModal = () => {
  const modalEl = document.getElementById('messageModal')
  const modal = new bootstrap.Modal(modalEl)
  modal.show()
}

const addDebt = async () => {
  if (!user.value) {
    modalMessage.value = 'You must be logged in.'
    modalTitle.value = 'Error'
    modalTypeClass.value = 'bg-danger text-white'
    showModal()
    return
  }

  // Form validation
  const form = document.querySelector('.needs-validation')
  if (!form.checkValidity()) {
    form.classList.add('was-validated')
    return
  }

  try {
    let pictureUrl = ''
    if (transactionPicture.value) {
      const pictureRef = storageRef(
        storage,
        `transaction-pictures/${user.value.uid}/${Date.now()}_${transactionPicture.value.name}`,
      )
      const snapshot = await uploadBytes(pictureRef, transactionPicture.value)
      pictureUrl = await getDownloadURL(snapshot.ref)
    }

    await addDoc(collection(db, 'debts'), {
      debtSource: debtSource.value,
      item: loanType.value === 'Sangla' ? item.value : '',
      loanAmount: loanType.value === 'Sangla' ? parseFloat(loanAmount.value) : null,
      amount: parseFloat(amount.value),
      renewalDate: loanType.value === 'Sangla' ? renewalDate.value : '',
      dueDate: ['Splaylater', 'Gloan', 'Gcredit'].includes(loanType.value) ? dueDate.value : '',
      loanType: loanType.value,
      isPaid: isPaid.value,
      transactionPicture: pictureUrl,
      userId: user.value.uid,
      createdAt: serverTimestamp(),
    })

    modalMessage.value = 'Debt added successfully!'
    modalTitle.value = 'Success'
    modalTypeClass.value = 'bg-success text-white'
    showModal()

    // Reset form
    debtSource.value = ''
    item.value = ''
    loanAmount.value = 0
    amount.value = 0
    renewalDate.value = ''
    dueDate.value = ''
    loanType.value = ''
    isPaid.value = false
    transactionPicture.value = null
    form.classList.remove('was-validated')
  } catch (error) {
    modalMessage.value = error.message
    modalTitle.value = 'Error'
    modalTypeClass.value = 'bg-danger text-white'
    showModal()
  }
}
</script>

<style scoped>/* Apply Poppins globally inside this component */
:host, * {
  font-family: 'Poppins', sans-serif;
}

/* Gradient Button */
.gradient-btn {
  background: var(--primary-gradient) !important;
  border: none;
  color: white !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;
}

.gradient-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.gradient-btn:hover::before {
  left: 100%;
}

.glass-card {
  margin-top: 1rem;      /* pushes it down */
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-strength));
  -webkit-backdrop-filter: blur(var(--blur-strength));
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;
}

.glass-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.glass-input {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  transition: var(--transition-smooth);
  color: inherit;
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.15);
  outline: none;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.5);
  transform: scale(1.02);
}

.form-label {
  font-weight: 600;
  color: inherit;
  margin-bottom: 0.5rem;
}

.form-check-input:checked {
  background: var(--primary-gradient);
  border-color: transparent;
}

.modal-content {
  border: none;
  box-shadow: var(--glass-shadow);
}

.modal-header {
  border-bottom: 1px solid var(--glass-border);
}

.modal-footer {
  border-top: 1px solid var(--glass-border);
}
</style>
