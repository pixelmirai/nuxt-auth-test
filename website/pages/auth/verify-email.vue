<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('your email.')
const status = ref('idle') // idle | verifying | waiting | error
const errorMessage = ref('')
const resendLoading = ref(false)
const resentNotice = ref('')

async function sendToken() {
  errorMessage.value = ''
  resentNotice.value = ''

  if (!email.value) {
    errorMessage.value = 'Missing email address to resend verification.'
    return
  }

  resendLoading.value = true
  try {
    await authStore.resendVerification(email.value)
    resentNotice.value = 'Verification email sent again. Check your inbox.'
  } catch (err) {
    console.log(err)
    errorMessage.value = 'Could not resend right now. Please try again.'
  } finally {
    resendLoading.value = false
  }
}

async function verifyEmail() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  console.log(token)

  if (token) {
    status.value = 'verifying'
    try {
      await authStore.verifyEmail(token);
      router.push('/')
      return
    } catch (err) {
      console.log(err);
      status.value = 'error'
      errorMessage.value = 'Verification failed. Please request a new link.'
    }
  } else {
    status.value = 'waiting'
    errorMessage.value = 'No verification token found. Request a new link below.'
  }
}

onMounted(async () => {
  await verifyEmail();
  email.value = sessionStorage.getItem("pendingEmail");
  console.log("in new pge", sessionStorage.getItem("pendingEmail"))

})

</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
    <div class="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">Verify your email</p>
            <h1 class="mt-2 text-3xl font-semibold text-white sm:text-4xl">Almost there. Secure your account.</h1>
            <p class="mt-2 max-w-2xl text-slate-200">
              We sent a link to confirm your email. Finish verification to unlock your account.
            </p>
          </div>
          <div class="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-100 ring-1 ring-white/20">
            {{ email || 'Awaiting email...' }}
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-800/30">
            <div v-if="status === 'verifying'" class="flex min-h-[240px] flex-col items-start justify-center space-y-4 text-left">
              <div class="flex items-center gap-3">
                <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-300/40">
                  <span class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent"></span>
                </span>
                <div>
                  <p class="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-200">Verifying</p>
                  <p class="text-lg font-semibold text-white">Confirming your email now...</p>
                </div>
              </div>
              <p class="max-w-xl text-slate-200">Sit tight. This will only take a moment.</p>
            </div>

            <div v-else class="space-y-6">
              <div class="flex items-center gap-3">
                <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-300/40">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6.75 12 12l9-5.25M4.5 18.75h15a1.5 1.5 0 0 0 1.5-1.5V6.75A1.5 1.5 0 0 0 19.5 5.25h-15A1.5 1.5 0 0 0 3 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5Z" />
                  </svg>
                </span>
                <div>
                  <p class="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-200">Check your inbox</p>
                  <p class="text-lg font-semibold text-white">Click the verification link we sent.</p>
                </div>
              </div>

              <div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p class="text-sm font-semibold text-indigo-100">Having trouble?</p>
                <ul class="mt-2 space-y-2 text-sm text-slate-200">
                  <li class="flex items-start gap-2">
                    <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
                    Copy the link from your email into this browser tab.
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
                    Check spam or promotions folders if you do not see it.
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="mt-1 h-2 w-2 rounded-full bg-indigo-300"></span>
                    Request another email with the button below.
                  </li>
                </ul>
              </div>

              <div class="space-y-2">
                <button
                  type="button"
                  class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                  @click="sendToken"
                  :disabled="resendLoading"
                >
                  <span v-if="resendLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>{{ resendLoading ? 'Sending...' : 'Resend verification email' }}</span>
                </button>
                <p v-if="resentNotice" class="text-sm font-semibold text-green-300">{{ resentNotice }}</p>
                <p v-if="errorMessage" class="text-sm font-semibold text-red-300">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-800/30 backdrop-blur">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">What happens next</p>
            <div class="mt-4 space-y-4 text-slate-200">
              <div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p class="text-base font-semibold text-white">1. Open the email</p>
                <p class="text-sm text-slate-200">Find the message titled “Verify your account”.</p>
              </div>
              <div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p class="text-base font-semibold text-white">2. Click the secure link</p>
                <p class="text-sm text-slate-200">The link will bring you back here to confirm automatically.</p>
              </div>
              <div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p class="text-base font-semibold text-white">3. Get redirected</p>
                <p class="text-sm text-slate-200">Once verified, we will redirect you to your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
