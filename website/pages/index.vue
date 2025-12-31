<script setup lang="js">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const { user, status } = storeToRefs(authStore)

onMounted(async () => {
  if (status.value === 'unknown') {
    await authStore.init()
  }

  watch(
    () => status.value,
    (val) => {
      if (val === 'unauthenticated') {
        router.push('/auth/login')
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <div class="p-6">
    <div class="mb-4 text-xl font-semibold text-slate-800">Index</div>
    <pre class="rounded-lg bg-slate-100 p-4 text-slate-700">{{ user }}</pre>
  </div>
</template>
