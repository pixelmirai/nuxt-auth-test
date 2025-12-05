<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form State
const form = ref({
  email: '',
  password: '',
})

// Validation State
const errors = ref({
  email: '',
  password: '',
})

// Submit State
const isSubmitting = ref(false)

// Validation Rules
const validateForm = () => {
  errors.value = {
    email: '',
    password: '',
  }

  let isValid = true

  if (!form.value.email.trim() || !/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Valid email is required'
    isValid = false
  }

  if (!form.value.password.trim()) {
    errors.value.password = 'Password is required'
    isValid = false
  }

  return isValid
}

// Handle Submit with Axios
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await axios.post('/api/login', {
      email: form.value.email,
      password: form.value.password,
    })

    console.log(response.data)
    router.push('/dashboard') // Redirect on success
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full p-2 border rounded-md"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium">Password</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              class="w-full p-2 border rounded-md"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Logging In...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
input {
  outline: none;
}
input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}
</style>
