<script setup lang="js">
import axios from "axios"
import { useAuthStore } from '~/stores/auth.store'


const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
onMounted(()=>{

})

onMounted(async () => {

})
</script>

<template>
  <div>
     <div>
        logged in 

     </div>
     <div>
      {{ user }}
     </div>
  </div>
</template>
