<script setup lang="js">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth.store'
import Auth from '~/components/Auth.vue'

const authStore = useAuthStore()
const { status } = storeToRefs(authStore)

async function logout(){
  await authStore.logout()
}

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
    <header class="flex justify-end sticky top-0 z-30 py-2 px-2 ">
        <button v-if="isAuthenticated" @click="logout"  class="px-4 py-1 bg-blue-600 text-white" >Logout</button>
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
