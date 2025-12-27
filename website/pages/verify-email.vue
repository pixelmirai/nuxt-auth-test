<script setup lang="js">
import {useRouter} from "vue-router";
import { useAuthStore } from '~/stores/auth.store'

const router = useRouter();
const authStore = useAuthStore();



onMounted(async ()=>{

const response = await authStore.verifyEmail()


})

</script>
<template>
    <VerifyEmail></VerifyEmail>
</template>