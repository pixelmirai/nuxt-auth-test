<script setup lang="js">
import { ref, computed } from "vue";
import {useAuthStore} from "~/stores/auth.store.js";
import {storeToRefs} from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";

const authStore = useAuthStore();
const router = useRouter();
const { status } = storeToRefs(authStore)
const { user } = storeToRefs(authStore);

const a ="http://localhost:3002"
const b = 'https://express-auth-1-1.onrender.com'

const BASE_URL = b

const successMessage = ref("")
const errorMessage = ref("")
const resetLoading = ref(false)

const displayName = computed(() => {
  if (user.value?.name) return user.value.name;
  return user.value?.email || "Profile";
})

const initials = computed(() => {
  const source = displayName.value || "";
  return source.slice(0, 1).toUpperCase();
})

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString();
  } catch (_) {
    return value;
  }
};

function redirectToAuth(){
  router.push("/")
}

async function refresh(){
  await authStore.refresh();
}

async function withHandledErrors(callback) {

  const withRefresh = async (callback) => {
    try {
      return await callback();
    } catch (error) {
      if (error.response?.status === 401) {
        await refresh(); ///
        return await callback();
      }
      throw error;
    }
  }

  const handleCommonErrors = (error) => {
    const status = error.response?.status;
    if (status === 401) {
      redirectToAuth() /// 
      throw new Error("Unauthorized!")
    } else if (status === 403) {
      throw new Error("Forbiden");
    } else if (status === 404) {
      throw new Error("User not found!");
    } else if (status > 499) {
      throw new Error("Server error!")
    } else {
      const message = error.message || "Something went wrong";
      throw new Error(message);
    }
  }

  try {
    return await withRefresh(callback)
  } catch (error) {
    handleCommonErrors(error);
  }
}

async function requestPasswordReset(baseUrl, email){
  const token = authStore.getToken(); //

  const req = async () => {
    const url = `${BASE_URL}/auth/request-password-reset`
    const body = { email };
    const config = { headers: { Authorization: token }, withCredentials: true };
  
    const response = await axios.post(url, body, config);
    return response;
  }

  try {
    resetLoading.value = true;
    errorMessage.value = "";
    const res = await withHandledErrors(req);
    successMessage.value = res?.data?.message || "Reset link sent to your email!";
    return res;
    console.log(res);
  } catch (error) {
    console.log(error);
    errorMessage.value = error?.message || error;
  }
  finally {
    resetLoading.value = false;
  }
}

watchEffect(status, ()=>{


})

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
    <div class="mx-auto max-w-4xl px-4 py-12 space-y-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">Profile</p>
          <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Your account</h1>
          <p class="mt-1 text-slate-200">Manage your details and keep your access secure.</p>
        </div>
        <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
          <span class="h-2 w-2 rounded-full" :class="status === 'authenticated' ? 'bg-emerald-400' : 'bg-amber-300'"></span>
          {{ status }}
        </span>
      </header>

      <div v-if="successMessage || errorMessage" class="space-y-2">
        <div v-if="successMessage" class="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {{ errorMessage?.message || errorMessage }}
        </div>
      </div>

      <div v-if="status === 'unknown'" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-indigo-900/30">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40">
          <span class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent"></span>
        </div>
        <p class="mt-4 text-lg font-semibold text-white">Loading your profile...</p>
        <p class="mt-2 text-sm text-slate-200">Hang tight while we confirm your session.</p>
      </div>

      <div v-else-if="status !== 'authenticated'" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-indigo-900/30">
        <p class="text-xl font-semibold text-white">You are signed out</p>
        <p class="mt-2 text-sm text-slate-200">Sign in to manage your profile and security.</p>
        <button
          class="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
          @click="redirectToAuth"
        >
          Go to auth
        </button>
      </div>

      <div v-else class="space-y-6">
        <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/30">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-xl font-semibold text-indigo-100 ring-1 ring-indigo-400/40">
              {{ initials }}
            </div>
            <div>
              <p class="text-sm font-semibold text-indigo-100">Signed in as</p>
              <p class="text-xl font-semibold text-white">{{ displayName }}</p>
              <p class="text-sm text-slate-300">{{ user?.email }}</p>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-300">Role</p>
              <p class="mt-1 text-lg font-semibold text-white">{{ user?.role || 'user' }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-300">Status</p>
              <p class="mt-1 text-lg font-semibold text-white">{{ user?.status || 'pending' }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-300">Created</p>
              <p class="mt-1 text-lg font-semibold text-white">{{ formatDate(user?.createdAt) }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-300">Updated</p>
              <p class="mt-1 text-lg font-semibold text-white">{{ formatDate(user?.updatedAt) }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <p class="text-xs uppercase tracking-[0.25em] text-slate-300">User ID</p>
              <p class="mt-1 text-lg font-semibold text-white break-all">{{ user?.id }}</p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/30">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-indigo-200">Security</p>
              <h2 class="text-xl font-semibold text-white">Password reset</h2>
              <p class="text-sm text-slate-200">Send a reset link to your email to update your password.</p>
            </div>
          </div>
          <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-sm text-slate-200">
              <p class="font-semibold text-white">{{ user?.email }}</p>
              <p class="text-slate-300">We will send the reset link to this address.</p>
            </div>
            <button
              class="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 sm:w-auto disabled:cursor-not-allowed disabled:bg-indigo-400"
              @click="requestPasswordReset(BASE_URL, user?.email)"
              :disabled="resetLoading || !user?.email"
            >
              <span v-if="resetLoading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span>{{ resetLoading ? 'Sending...' : 'Send reset link' }}</span>
            </button>
          </div>
          <div class="mt-3 space-y-2">
            <div v-if="successMessage" class="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {{ errorMessage?.message || errorMessage }}
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
