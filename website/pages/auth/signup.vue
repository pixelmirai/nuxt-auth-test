<script setup lang="js">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth.store'



const authStore = useAuthStore()
const router = useRouter()

const name = ref('pixel')
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

function goToVerifyEmail(email){
  if(!email) return;
  sessionStorage.setItem("pendingEmail",email);
  router.push("/auth/verify-email")
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords must match.'
    return
  }

  loading.value = true
  try {
    const response = await authStore.register(email.value.trim(), password.value, name.value.trim());
    success.value = 'Account created.'
    goToVerifyEmail(response.data.data.user.email)

  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Signup failed.'
    
    error.value = message
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto grid min-h-screen max-w-5xl grid-cols-1 items-center px-4 py-12 gap-10 sm:px-6 lg:max-w-6xl lg:grid-cols-2 lg:py-16">
      <div class="space-y-6 text-center lg:text-left">
        <p class="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200 ring-1 ring-white/20 sm:text-sm lg:mx-0">
          Create Account
        </p>
        <h1 class="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          Start fresh with a secure, modern account experience.
        </h1>
        <p class="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg lg:mx-0">
          Build your profile, enable collaboration, and stay connected. Your account keeps everything in one place.
        </p>
        <div class="grid grid-cols-1 gap-3 text-sm text-indigo-50 sm:grid-cols-2">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="font-semibold">No friction</p>
            <p class="mt-1 text-slate-200">Simple fields with clear guidance to finish in seconds.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="font-semibold">Ready to ship</p>
            <p class="mt-1 text-slate-200">Account is ready for use right after confirmation.</p>
          </div>
        </div>
      </div>

      <div class="w-full lg:justify-self-end">
        <div class="rounded-3xl bg-white p-6 shadow-2xl shadow-indigo-500/20 ring-1 ring-slate-200 sm:p-8">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 sm:text-sm">Sign up</p>
              <h2 class="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">Create your credentials</h2>
              <p class="text-sm text-slate-600">Set up your profile with a strong password to get started.</p>
            </div>
            <button
              type="button"
              class="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              @click="goToLogin"
            >
              I already have an account
            </button>
          </div>

          <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Full name</label>
              <input
                v-model="name"
                type="text"
                placeholder="Your name"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="At least 6 characters"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Confirm password</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div class="min-h-[24px] text-sm">
              <p v-if="error" class="text-sm font-semibold text-red-600">{{ error }}</p>
              <p v-else-if="success" class="text-sm font-semibold text-green-600">{{ success }}</p>
            </div>

            <button
              type="submit"
              :disabled="!canSubmit"
              class="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span>{{ loading ? 'Creating account...' : 'Create account' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
