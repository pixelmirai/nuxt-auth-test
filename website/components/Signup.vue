<script setup lang="js">
import { computed, ref } from 'vue'
import { useAuthStore } from '~/stores/auth.store'

const emit = defineEmits(['switchToLogin'])
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const canSubmit = computed(() => {
  return (
    name.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    password.value.trim().length >= 6 &&
    confirmPassword.value === password.value &&
    !loading.value
  )
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords must match.'
    return
  }

  loading.value = true
  try {
    await authStore.register(email.value.trim(), password.value, name.value.trim())
    success.value = 'Account created.'
  } catch (err) {
    const message = err?.data?.message || err?.message || 'Signup failed.'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="space-y-1 sm:col-span-2">
        <label class="text-sm font-medium text-gray-700">Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Your name"
          class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div class="space-y-1 sm:col-span-2">
        <label class="text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="At least 6 characters"
        class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>

    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">Confirm password</label>
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>

    <div class="min-h-[24px] text-sm">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-else-if="success" class="text-sm text-green-600">{{ success }}</p>
    </div>

    <button
      type="submit"
      :disabled="!canSubmit"
      class="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
    >
      <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      <span>{{ loading ? 'Creating account…' : 'Create account' }}</span>
    </button>

    <div class="flex items-center justify-between text-sm text-gray-600">
      <span>Already have an account?</span>
      <button type="button" class="font-medium text-indigo-600 hover:text-indigo-700" @click="emit('switchToLogin')">
        Sign in
      </button>
    </div>
  </form>
</template>
