<script setup lang="js">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth.store.js";

const router = useRouter();
const authStore = useAuthStore();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const token = ref(null);

const loadToken = () => {
  const url = new URL(window.location.href);
  const q = url.searchParams.get("token");
  token.value = q || null;
  if (!token.value) {
    errorMessage.value = "Reset link is missing or invalid.";
  }
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!token.value) {
    errorMessage.value = "Reset link is missing or invalid.";
    return;
  }

  if (!password.value || password.value.length < 8) {
    errorMessage.value = "Password must be at least 8 characters.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  loading.value = true;
  try {
    await authStore.resetPassword(password.value, token.value);
    successMessage.value = "Password updated. You can now log in.";
    password.value = "";
    confirmPassword.value = "";
  } catch (err) {
    console.log(err);
    errorMessage.value = err?.message || "Unable to reset password right now.";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/auth/login");
};

onMounted(() => {
  loadToken();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
    <div class="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12">
      <div class="w-full space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-900/30 backdrop-blur">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">Reset password</p>
            <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Set a new password</h1>
            <p class="mt-1 text-slate-200">Choose a strong password to secure your account.</p>
          </div>
          <div class="hidden sm:block rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-indigo-100 ring-1 ring-white/20">
            Secure reset
          </div>
        </div>

        <div class="space-y-2">
          <div v-if="successMessage" class="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {{ errorMessage }}
          </div>
        </div>

        <div v-if="successMessage" class="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p class="text-lg font-semibold text-white">All set!</p>
          <p class="mt-1 text-sm text-slate-200">Use your new password to log in.</p>
          <button
            class="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
            @click="goToLogin"
          >
            Go to login
          </button>
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2 sm:col-span-2">
            <label class="text-sm font-semibold text-slate-100">New password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter new password"
              class="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
            />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-sm font-semibold text-slate-100">Confirm password</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              class="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
            />
          </div>
          <div class="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              class="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 sm:w-auto disabled:cursor-not-allowed disabled:bg-indigo-400"
              :disabled="loading"
              @click="handleSubmit"
            >
              <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span>{{ loading ? 'Saving...' : 'Update password' }}</span>
            </button>
            <p class="text-xs text-slate-300">Use at least 8 characters and avoid reused passwords.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
