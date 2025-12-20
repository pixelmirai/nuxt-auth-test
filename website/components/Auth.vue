<script>


    
</script>

<script setup lang="js">
import { ref } from 'vue'
import Login from '~/components/Login.vue'
import Signup from '~/components/Signup.vue'

const mode = ref('login') // 'login' | 'signup'

const switchToSignup = () => {
  mode.value = 'signup'
}

const switchToLogin = () => {
  mode.value = 'login'
}
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4">
    <div class="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-indigo-100/40">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-indigo-500">Access required</p>
          <h2 class="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p class="text-gray-600">Log in to continue, or create an account to get started.</p>
        </div>
        <div class="hidden h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:flex">
          🔐
        </div>
      </div>

      <div class="mt-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm font-medium text-gray-700">
        <button
          class="flex-1 rounded-md px-3 py-2 transition"
          :class="mode === 'login' ? 'bg-white shadow-sm text-indigo-700' : 'hover:text-indigo-600'"
          type="button"
          @click="switchToLogin"
        >
          Login
        </button>
        <button
          class="flex-1 rounded-md px-3 py-2 transition"
          :class="mode === 'signup' ? 'bg-white shadow-sm text-indigo-700' : 'hover:text-indigo-600'"
          type="button"
          @click="switchToSignup"
        >
          Sign up
        </button>
      </div>

      <div class="mt-6">
        <Login v-if="mode === 'login'" @switch-to-signup="switchToSignup" />
        <Signup v-else @switch-to-login="switchToLogin" />
      </div>
    </div>
  </div>
</template>
