<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useRouter } from 'vue-router'


const router = useRouter();
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const success = ref('')

const canSubmit = computed(
  () => email.value.trim().length > 0 && password.value.trim().length > 0 && !loading.value
)


function goToVerifyEmail(email: any) {
  if (!email) return;
  sessionStorage.setItem("pendingEmail", email);
  router.push("/auth/verify-email")
}

//for password logins
async function handleError(error: any) {
  console.log(error)
  const code = error?.response?.data?.code;
  if (code) {

    if (code === "INVALID_CREDENTIALS") {
      errorMessage.value = "Email or passwords incorrect.";
    }
    else if (code === "EMAIL_NOT_VERIFIED") {
      await authStore.resendVerification(email.value)
      goToVerifyEmail(email.value);
    } else if (code === "USER_BANNED") {
      errorMessage.value = "you are banned"
    }

  } else if (error?.status) {
    const status = error.status;
    if (status === 401) {
      errorMessage.value = "Email or passwords incorrect.";
    }
    else if (status === 403) {
      await authStore.resendVerification(email.value)
      goToVerifyEmail(email.value);
    }
  } else {
    errorMessage.value = "Login failed!"
  }

}

const handleSubmit = async () => {
  errorMessage.value = ''
  success.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  loading.value = true
  try {
    const response = await authStore.login(email.value.trim(), password.value)
    success.value = 'Logged in successfully.'
    router.push("/")
  } catch (err: any) {
    await handleError(err);
  } finally {
    loading.value = false
  }
}

async function googleInit() {
  if (typeof window === 'undefined') return
  const google = (window as any).google
  if (!google?.accounts?.id) return

    ; (window as any).__gsi_inited = true
    google.accounts.id.initialize({
    client_id: '583517203824-0sp6oqjt0o14s3i9lm7j9qmnuhrgkc52.apps.googleusercontent.com',
    callback: async ({ credential }: { credential: string }) => {
      try {
        await authStore.loginWithGoogle(credential);
      router.push("/")
      } catch (error) {
        console.log(error)
        errorMessage.value = error.message
      }
      
    }
  })

  google.accounts.id.renderButton(
    document.getElementById('googleBtn'),
    { theme: 'outline', size: 'large' }
  )
}

onMounted(() => {
  googleInit()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
    <div
      class="mx-auto grid min-h-screen max-w-5xl grid-cols-1 items-center px-4 py-12 gap-10 sm:px-6 lg:max-w-6xl lg:grid-cols-2 lg:py-16">
      <div class="space-y-6 text-center lg:text-left">
        <p
          class="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200 ring-1 ring-white/20 sm:text-sm lg:mx-0">
          Access Portal
        </p>
        <h1 class="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          Welcome back. Sign in to keep building amazing things.
        </h1>
        <p class="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg lg:mx-0">
          Use your account credentials or continue with Google. Security-first authentication keeps your data safe while
          you move fast.
        </p>
        <div class="grid grid-cols-1 gap-3 text-sm text-indigo-50 sm:grid-cols-2">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="font-semibold">Instant access</p>
            <p class="mt-1 text-slate-200">Jump back into your projects without losing momentum.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="font-semibold">Secure by default</p>
            <p class="mt-1 text-slate-200">Protected sign-in with password or Google identity.</p>
          </div>
        </div>
      </div>

      <div class="w-full lg:justify-self-end">
        <div class="rounded-3xl bg-white p-6 shadow-2xl shadow-indigo-500/20 ring-1 ring-slate-200 sm:p-8">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 sm:text-sm">Log in</p>
              <h2 class="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">Enter your credentials</h2>
              <p class="text-sm text-slate-600">Use the email and password you registered with.</p>
            </div>
            <NuxtLink to="/auth/signup" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Create account
            </NuxtLink>
          </div>

          <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Email</label>
              <input v-model="email" type="email" placeholder="you@example.com"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Password</label>
              <input v-model="password" type="password" placeholder="Enter your password"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div class="min-h-[24px] text-sm">
              <p v-if="errorMessage" class="text-sm font-semibold text-red-600">{{ errorMessage }}</p>
              <p v-else-if="success" class="text-sm font-semibold text-green-600">{{ success }}</p>
            </div>

            <button type="submit" :disabled="!canSubmit"
              class="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400">
              <span v-if="loading"
                class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <div class="mt-6">
            <div class="flex items-center gap-3 text-slate-400">
              <div class="h-px flex-1 bg-slate-200"></div>
              <span class="text-xs font-semibold uppercase tracking-[0.3em]">or</span>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>
            <div class="mt-4 flex justify-center">
              <div id="googleBtn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
