<script setup lang="js">
import { computed, ref } from 'vue'
import { useAuthStore } from '~/stores/auth.store'

const emit = defineEmits(['switchToSignup'])
const authStore = useAuthStore()

const email = ref('johnsmithsony1985@gmail.com')
const password = ref('Qqsb8ku5x!!!')
const loading = ref(false)
const error = ref('')
const success = ref('')

const canSubmit = computed(
  () => email.value.trim().length > 0 && password.value.trim().length > 0 && !loading.value
)

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Please enter your email and password.'
    return
  }

  loading.value = true
  try {
    console.log("in form before")
    await authStore.login(email.value.trim(), password.value)
      console.log("in form after")
    success.value = 'Logged in successfully.'
  } catch (err) {
    const message = err?.data?.message || err?.message || 'Login failed.'
    error.value = message
  } finally {
    loading.value = false
  }
}




async function googleInit(){



window.__gsi_inited = true
  google.accounts.id.initialize({
    client_id: "583517203824-0sp6oqjt0o14s3i9lm7j9qmnuhrgkc52.apps.googleusercontent.com",
    callback: async ({ credential }) => {
      console.log("ID TOKEN:", credential)
       await authStore.loginWithGoogle(credential);
    },
  })

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    { theme: "outline", size: "large" }
  )
}

onMounted(() => {
 googleInit();
})

</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>

    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="••••••••"
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
      <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
    </button>

    

    <div class="flex items-center justify-between text-sm text-gray-600">
      <span>Don't have an account?</span>
      <button type="button" class="font-medium text-indigo-600 hover:text-indigo-700" @click="emit('switchToSignup')">
        Create one
      </button>
    </div>
  </form>

    <div id="googleBtn">

    </div>
</template>
