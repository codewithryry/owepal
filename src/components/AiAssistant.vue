<template>
  <div class="ai-assistant">
    <!-- Floating toggle button (only visible when closed) -->
  <button 
    v-if="!isOpen"
    class="toggle-btn float-animation pulse-glow" 
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
    <div v-else class="assistant-body glass slide-in-bottom">
      <div class="assistant-header slide-in-bottom">
        <h4 class="assistant-title">Owely</h4>
        <button class="close-btn pulse-glow" @click="isOpen = false">
          <!-- Close (X) icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      <!-- Chat messages -->
      <div class="messages slide-in-left stagger-1">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="['message', msg.type, 'slide-in-bottom']"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="message-content">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Input box -->
      <form @submit.prevent="sendMessage" class="input-form slide-in-bottom stagger-2">
        <div class="input-wrapper">
          <input 
            v-model="input" 
            placeholder="Ask Owely about your finances..." 
            class="message-input"
          />
          <button type="submit" class="send-btn pulse-glow" :disabled="!input.trim()">
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
  transition: var(--transition-smooth);
}

.toggle-btn {
  position: fixed;
  bottom: 40px; /* lifted above bottom nav */
  right: 40px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: var(--transition-smooth);
  z-index: 2002; /* higher than chat box */
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

/* Hover effect */
.toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

.toggle-btn:hover::before {
  left: 100%;
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
  background: var(--secondary-gradient);
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
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-strength));
  -webkit-backdrop-filter: blur(var(--blur-strength));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

/* Header */
.assistant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--glass-border);
}

.assistant-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Close button */
.close-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.close-btn:hover { 
  background: var(--glass-bg);
  transform: scale(1.1);
}

/* Messages */
.messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.05);
}

.message {
  margin-bottom: 1rem;
  display: flex;
  animation: messageSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  position: relative;
  overflow: hidden;
  transition: var(--transition-smooth);
}

.message-content:hover {
  transform: scale(1.02);
}

.message.user .message-content {
  background: var(--primary-gradient);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.message.ai .message-content {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: inherit;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Input */
.input-form {
  padding: 1rem;
  border-top: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 25px;
  padding: 0.25rem;
  transition: var(--transition-smooth);
}

.input-wrapper:focus-within {
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  transform: scale(1.02);
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background: transparent;
  color: inherit;
}

.message-input::placeholder { 
  color: rgba(255, 255, 255, 0.6);
}

/* Send button */
.send-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
  opacity: 0.8;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.send-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.send-btn:not(:disabled):hover {
  transform: scale(1.1);
  opacity: 1;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.send-btn:not(:disabled):hover::before {
  left: 100%;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes messageSlide {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
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
