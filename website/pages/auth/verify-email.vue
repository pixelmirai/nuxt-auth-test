<script setup lang="js">
import { useAuthStore } from '~/stores/auth.store'
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

function sendToken(){

}

const email = ref("your email.")

async function verifyEmail(){
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  console.log(token)
  if(token){
    try {
     await authStore.verifyEmail(token);
     router.push('/')
    } catch (err) {
      console.log(err);
    }
  }

}

onMounted(async ()=>{
    await verifyEmail();
    email.value = sessionStorage.getItem("pendingEmail");
    console.log("in new pge", sessionStorage.getItem("pendingEmail"))

})

</script>
<template>
    <div class="">
          Verification link sent to {{email  }}
    </div>
</template>