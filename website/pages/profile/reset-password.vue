<script setup lang="js">
import {useAuthStore} from "~/stores/auth.store.js";

const authStore = useAuthStore()

const res = ref("response")

async function resetPassword(newPassword = ""){
  try {
    const response = await authStore.resetPassword(newPassword);
    res.value = response;

  } catch (error) {
    console.log(error);
    res.value = error;
  }
}

onMounted(async () => {
    await resetPassword()
})
</script>

<template>
<div>
  reseting

  --------


</div>
<div>
    {{ res }}
</div>
</template>

<style scoped>

</style>