<template>
  <div class="ai-assistant" :class="{ open: isOpen }">
    <button class="toggle-btn" @click="isOpen = !isOpen">AI</button>

    <div v-if="isOpen" class="assistant-body">
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.type">
          {{ msg.text }}
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="input-form">
        <input v-model="input" placeholder="Ask me anything..." />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const isOpen = ref(false)
const input = ref('')
const messages = ref([])

// Replace with environment variable
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY

const sendMessage = async () => {
  if (!input.value.trim()) return

  messages.value.push({ type: 'user', text: input.value })
  const userInput = input.value
  input.value = ''

  try {
    const response = await axios.post(
      'https://api.cohere.ai/generate',
      {
        model: 'xlarge',
        prompt: userInput,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const botReply = response.data.generations[0].text
    messages.value.push({ type: 'ai', text: botReply })
  } catch (error) {
    console.error('Cohere API error:', error)
    messages.value.push({ type: 'ai', text: 'Oops! Something went wrong.' })
  }
}
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  font-family: sans-serif;
  z-index: 2000;
}

.toggle-btn {
  background-color: var(--bs-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.assistant-body {
  margin-top: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  height: 400px;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.messages .user {
  text-align: right;
  margin-bottom: 8px;
  color: var(--bs-primary);
}

.messages .ai {
  text-align: left;
  margin-bottom: 8px;
  color: #333;
}

.input-form {
  display: flex;
  border-top: 1px solid #ddd;
}

.input-form input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
}

.input-form button {
  background-color: var(--bs-primary);
  color: white;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
}
</style>
