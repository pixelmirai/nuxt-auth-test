<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from "axios";
const router = useRouter()

// Form State
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Validation State
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Submit State
const isSubmitting = ref(false)

// Validation Rules
const validateForm = () => {
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  let isValid = true

  if (!form.value.username.trim()) {
    errors.value.username = 'Username is required'
    isValid = false
  }

  if (!form.value.email.trim() || !/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Valid email is required'
    isValid = false
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

// Handle Submit
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/signup', {
      method: 'POST',
      body: {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
      },
    })

    console.log(response)
    router.push('/') // Redirect on success
  } catch (error) {
    console.error('Signup failed:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Create Account</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium">Username</label>
          <input
              id="username"
              v-model="form.username"
              type="text"
              class="w-full p-2 border rounded-md"
          />
          <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
        </div>

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
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium">Password</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              class="w-full p-2 border rounded-md"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm font-medium">Confirm Password</label>
          <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="w-full p-2 border rounded-md"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Creating Account...' : 'Sign Up' }}
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
