<script>
import { useAuthStore } from '~/stores/auth.store'

function sendToken(){

}

const email = ref("your email.")

onMounted(async ()=>{
    email.value = sessionStorage.getItem("pendingEmail");

})

</script>
<template>
    <div class="">
          Verification link sent to{{email  }}
    </div>
</template>