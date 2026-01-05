<script setup lang="js">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth.store'
import {useRouter} from "vue-router";

const router = useRouter();

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

const isAuthenticated = computed(() => status.value === 'authenticated' )

const isChecking = computed(() => status.value === 'unknown')
</script>

<template>
  <div>
    <header class="flex justify-end sticky top-0 z-30  ">
        <button v-if="isAuthenticated" @click="logout"  class="px-4 py-1 bg-blue-600 text-white" >Logout</button>
      <button v-if="isAuthenticated" @click="router.push('/admin')"  class="px-4 py-1 bg-blue-600 text-white" >Admin</button>
      <button v-if="isAuthenticated" @click="router.push('profile')"  class="px-4 py-1 bg-blue-600 text-white" >Profile</button>
    </header>

    <main class="min-h-[90vh]">
      <slot></slot>
    </main>
    <footer>

    </footer>
  </div>
</template>
