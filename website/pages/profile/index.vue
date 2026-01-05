<script setup lang="js">
import {useAuthStore} from "~/stores/auth.store.js";
import {storeToRefs} from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";

const authStore = useAuthStore();
const router = useRouter();
const { status } = storeToRefs(authStore)
const { user } = storeToRefs(authStore);

const BASE_URL = 'http://localhost:3002'

const successMessage = ref("")
const errorMessage = ref("")

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
    const res = await withHandledErrors(req);

    ///
    successMessage.value = res.data?.message || "Reset link sent to your email!";
    ///
    return res;
    console.log(res);
  } catch (error) {
    console.log(error);
    errorMessage.value = error;
  }
}

watchEffect(status, ()=>{


})

</script>

<template>
  <div v-if="status === 'authenticated'">
    {{status}}
    {{ user }}

    <button @click="requestPasswordReset(BASE_URL, user?.email)">Req passowrd reset</button>
  </div>

</template>

<style scoped>

</style>