<script setup lang="js">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth.store'
import Auth from '~/components/Auth.vue'

const authStore = useAuthStore()
const { status } = storeToRefs(authStore)

onMounted(() => {
  if (status.value === 'unknown') {
    authStore.init()
  }
})

const isAuthenticated = computed(() => status.value === 'authenticated')
const isChecking = computed(() => status.value === 'unknown')
</script>

<template>
  <div>
    <header class="sticky top-0 z-30">

    </header>

    <main class="min-h-[90vh]">
      <div v-if="isChecking" class="flex min-h-[60vh] items-center justify-center text-gray-600">
        Checking authentication…
      </div>
      <template v-else-if="isAuthenticated">
        <slot />
      </template>
      <template v-else>
        <Auth />
      </template>
    </main>
    <footer>

    </footer>
  </div>
</template>
