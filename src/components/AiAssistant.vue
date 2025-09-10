<template>
  <div class="ai-assistant">
    <!-- Floating toggle button (only visible when closed) -->
  <button 
    v-if="!isOpen"
    class="toggle-btn" 
    @click="isOpen = true" 
    aria-label="Open Owely Assistant"
  >
    <img 
      src="/owely1.png" 
      alt="Owely AI Assistant" 
      width="28" 
      height="28" 
      class="ai-icon"
    />
  </button>

    <!-- Assistant panel (only visible when open) -->
    <div v-else class="assistant-body">
      <div class="assistant-header">
        <h4 class="assistant-title">Owely</h4>
        <button class="close-btn" @click="isOpen = false">
          <!-- Close (X) icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      <!-- Chat messages -->
      <div class="messages">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="['message', msg.type]"
        >
          <div class="message-content">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Input box -->
      <form @submit.prevent="sendMessage" class="input-form">
        <div class="input-wrapper">
          <input 
            v-model="input" 
            placeholder="Ask Owely about your finances..." 
            class="message-input"
          />
          <button type="submit" class="send-btn" :disabled="!input.trim()">
            <!-- Send icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.523 5.923a.5.5 0 0 0-.386.788L8 15.677l8.512-8.626a.5.5 0 0 0-.051-.702l-8.557-8.524a.5.5 0 0 1 .8-.8l8.5 8.5a.5.5 0 0 0 .702.051L15.964.686z"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>



<script setup>
import { ref, inject, watch, nextTick, onMounted } from 'vue'
import axios from 'axios'

const darkMode = inject('darkMode')
const isOpen = ref(false)
const input = ref('')
const messages = ref([])

const COHERE_API_KEY = 'y9K5K2JAVEHTjY0zzIcKg2iJrxg3XjdSbjMq22Ys'

const sendMessage = async () => {
  if (!input.value.trim()) return

  const userMessage = input.value
  messages.value.push({ type: 'user', text: userMessage })
  input.value = ''

  // Add typing indicator
  const typingMsg = { type: 'ai', text: 'Thinking...', isTyping: true }
  messages.value.push(typingMsg)

  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: `You are owely, a friendly and professional debt management assistant for the eDEBTZero app. Help the user manage their personal debts and finances with clear, actionable advice. User question: ${userMessage}`,
        max_tokens: 200,
        temperature: 0.7,
        stop_sequences: ["Human:", "Assistant:"]
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // Remove typing indicator
    messages.value.pop()
    
    const botReply = response.data.generations[0].text.trim()
    messages.value.push({ type: 'ai', text: botReply })
    
    // Auto-scroll to bottom
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Cohere API error:', error)
    // Remove typing indicator
    messages.value.pop()
    let errorMsg = 'Sorry, I encountered an error. Please try again or check your internet connection.'
    if (error.response?.status === 401) {
      errorMsg = 'Authentication error. Please check your Cohere API key.'
    } else if (error.response?.status === 429) {
      errorMsg = 'API quota exceeded. Please wait and try again later.'
    }
    messages.value.push({ type: 'ai', text: errorMsg })
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  const messagesContainer = document.querySelector('.messages')
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

// Close AI assistant when clicking outside (except on dropdowns)
const handleClickOutside = (event) => {
  const aiElement = event.target.closest('.ai-assistant')
  if (!aiElement && isOpen.value && !event.target.closest('.user-dropdown-container') && !event.target.closest('.settings-dropdown-container')) {
    isOpen.value = false
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    // Add click outside handler when opening
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
  } else {
    // Remove click outside handler when closing
    document.removeEventListener('click', handleClickOutside)
  }
})

onMounted(() => {
  if (messages.value.length === 0) {
    messages.value.push({ 
      type: 'ai', 
      text: 'Hi! I\'m Owely, your friendly debt management assistant for Owepal.' 
    })
  }
})
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 40px; /* above bottom navbar */
  right: 20px;
  width: 320px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 2001;
  transition: all 0.3s ease;
}

.toggle-btn {
  position: fixed;
  bottom: 40px; /* lifted above bottom nav */
  right: 40px;
  background: var(--bs-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  z-index: 2002; /* higher than chat box */
}

/* Hover effect */
.toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(var(--bs-primary-rgb), 0.4);
}

.toggle-btn svg {
  margin-right: 2px;
}

.toggle-btn img,
.toggle-btn svg {
  width: 54px;
  height: 48px;
}

/* BETA Badge */
.toggle-btn::after {
  content: "BETA";
  position: absolute;
  top: -12px;    /* place above the button */
  right: -2px;   /* shift a bit to align */
  background: #ff4757; /* red badge */
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  white-space: nowrap;
}


/* Chat box */
.assistant-body {
  margin-top: 10px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 450px;
  width: 320px;
  max-height: 70vh;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

/* Dark mode */
[data-bs-theme='dark'] .assistant-body {
  background: #1f2a44;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Header */
.assistant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
[data-bs-theme='dark'] .assistant-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.assistant-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}
[data-bs-theme='dark'] .assistant-title {
  color: #e5e7eb;
}

/* Close button */
.close-btn {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
[data-bs-theme='dark'] .close-btn { color: #e5e7eb; }
.close-btn:hover { background-color: rgba(0, 0, 0, 0.05); }
[data-bs-theme='dark'] .close-btn:hover { background-color: rgba(255, 255, 255, 0.1); }

/* Messages */
.messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f8f9fa;
}
[data-bs-theme='dark'] .messages { background: #2d3748; }

.message {
  margin-bottom: 1rem;
  display: flex;
  animation: messageSlide 0.2s ease-out;
}
.message.user { justify-content: flex-end; }
.message.ai { justify-content: flex-start; }

.message-content {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}
.message.user .message-content {
  background-color: var(--bs-primary);
  color: white;
  border-bottom-right-radius: 4px;
}
.message.ai .message-content {
  background-color: #e9ecef;
  color: #333;
  border-bottom-left-radius: 4px;
}
[data-bs-theme='dark'] .message.ai .message-content {
  background-color: #4b5563;
  color: #e5e7eb;
}

/* Input */
.input-form {
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
}
[data-bs-theme='dark'] .input-form {
  border-top-color: rgba(255, 255, 255, 0.1);
  background: #1f2a44;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 25px;
  padding: 0.25rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}
[data-bs-theme='dark'] .input-wrapper {
  background: #2d3748;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background: transparent;
  color: #333;
}
[data-bs-theme='dark'] .message-input { color: #e5e7eb; }
.message-input::placeholder { color: #6c757d; }
[data-bs-theme='dark'] .message-input::placeholder { color: #9ca3af; }

/* Send button */
.send-btn {
  background: var(--bs-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.8;
  flex-shrink: 0;
}
.send-btn:not(:disabled):hover {
  background: #0d6efd;
  transform: scale(1.05);
  opacity: 1;
}
.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animations */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes messageSlide {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ✅ Mobile (same as desktop, floating above navbar) */
@media (max-width: 480px) {
  .ai-assistant {
    right: 20px;
    bottom: 40px; /* stays above bottom navbar */
    width: 320px;
    max-width: 90vw; /* prevent overflow */
  }
  .assistant-body {
    height: 400px;
    max-height: 70vh;
    border-radius: 14px;
  }
  .toggle-btn {
    right: 20px;
    width: 52px;
    height: 52px;
    font-size: 0.8rem;
  }
}
</style>
