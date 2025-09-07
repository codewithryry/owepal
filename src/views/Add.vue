<template>
  <div class="card glass-card shadow-sm mb-4">
    <div class="card-body">
      <h2 class="h5 fw-bold mb-4">Add New Debt</h2>
      <form @submit.prevent="addDebt" class="needs-validation" novalidate>
        <!-- Debt Source -->
        <div class="mb-3">
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
        <div v-if="loanType === 'Sangla'" class="mb-3">
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

        <!-- Amount -->
        <div class="mb-3">
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
        <div v-if="loanType === 'Sangla'" class="mb-3">
          <label for="renewalDate" class="form-label">Renewal Date</label>
          <input v-model="renewalDate" type="date" class="form-control glass-input" id="renewalDate" required />
        </div>

        <!-- Due Date for Splaylater -->
        <div v-if="loanType === 'Splaylater'" class="mb-3">
          <label for="dueDate" class="form-label">Due Date</label>
          <input v-model="dueDate" type="date" class="form-control glass-input" id="dueDate" required />
        </div>

        <!-- Loan Type -->
        <div class="mb-3">
          <label for="loanType" class="form-label">Loan Type</label>
          <select v-model="loanType" class="form-select glass-input" id="loanType" required>
            <option value="" disabled>Select Loan Type</option>
            <option value="Sangla">Sangla (Pawn)</option>
            <option value="Gloan">Gloan</option>
            <option value="Gredit">Gredit</option>
            <option value="Splaylater">Splaylater (Installment)</option>
          </select>
        </div>

        <!-- Mark as Paid -->
        <div class="mb-3 form-check">
          <input v-model="isPaid" type="checkbox" class="form-check-input" id="isPaid" />
          <label class="form-check-label" for="isPaid">Mark as Paid</label>
        </div>

        <!-- Transaction Picture -->
        <div class="mb-3">
          <label for="transactionPicture" class="form-label">Transaction Picture (Optional)</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="form-control glass-input"
            id="transactionPicture"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">Add Debt</button>
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
      <div class="modal-content glass-card">
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
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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

  try {
    let pictureUrl = ''
    if (transactionPicture.value) {
      const pictureRef = storageRef(
        storage,
        `transaction-pictures/${user.value.uid}/${Date.now()}_${transactionPicture.value.name}`
      )
      const snapshot = await uploadBytes(pictureRef, transactionPicture.value)
      pictureUrl = await getDownloadURL(snapshot.ref)
    }

    await addDoc(collection(db, 'debts'), {
      debtSource: debtSource.value,
      item: loanType.value === 'Sangla' ? item.value : '',
      amount: parseFloat(amount.value),
      renewalDate: loanType.value === 'Sangla' ? renewalDate.value : '',
      dueDate: loanType.value === 'Splaylater' ? dueDate.value : '',
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
    amount.value = 0
    renewalDate.value = ''
    dueDate.value = ''
    loanType.value = ''
    isPaid.value = false
    transactionPicture.value = null
  } catch (error) {
    modalMessage.value = error.message
    modalTitle.value = 'Error'
    modalTypeClass.value = 'bg-danger text-white'
    showModal()
  }
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.glass-input {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  transition: all 0.2s;
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.18);
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
}
</style>
