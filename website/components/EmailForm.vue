<script setup lang="js">
import axios from "axios";
import { useRoute } from "vue-router"
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns';
import { useWindowSize } from "@/composables/useWindowSize";
import { useInView } from "@/composables/useInView";
import { useScrollHandler } from "@/composables/useScrollHandler"
import { useHTMLContent } from '~/composables/useHTMLContent'
import { useWpPosts } from '~/stores/useWpPosts'

const props = defineProps({

})

const emit = defineEmits([])

defineExpose({

})

const route = useRoute();
const router = useRouter();
const { smallWindow, mediumWindow, largeWindow } = useWindowSize();
const scroll = useScrollHandler();

const wpPosts = useWpPosts();
const html = useHTMLContent();

//

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  message: ''
});

const responseMessage = ref("");
const buttonText = ref("Send")

onMounted(() => {

})

onUnmounted(() => {

})

async function handleSubmit() {

  try {
    buttonText.value = "Sending..."
    const response = await axios.post('/api/contact', form.value);
    buttonText.value = "Email sent!";
    form.value = { email: '', subject: '', message: '' };
  } catch (error) {
    responseMessage.value = "Something went wrong!"
    buttonText.value = "Try again"
      ;
  }
}

function submissionVisuals() {

}

</script>

<template>

  <div class=" bg-blue-950   min-w-[350px]">
    <form @submit.prevent="handleSubmit" class="flex flex-col space-y-4 w-full min-w-[350px]  p-2">

      <div class="flex flex-wrap gap-4 w-full ">
        <div class=" flex-grow">
          <label for="firstName" class=""></label>
          <input id="firstName" v-model="form.firstName" type="text" placeholder="First Name" class="fields w-full  ">
        </div>
        <div class=" flex-grow">
          <label for="lastName"></label>
          <input id="lastName" v-model="form.lastName" type="text" placeholder="Last Name" class="fields w-full ">
        </div>
      </div>
      <div class="flex flex-col ">
        <label for="email" class=""></label>
        <input id="email" v-model="form.email" type="email" required placeholder="Email" class=" fields h-8  ">
      </div>


      <div class="">
        <label for="message" class=""></label>
        <textarea id="message" v-model="form.message" required class="w-full fields " rows="8"
          placeholder="Tell us..."></textarea>
      </div>
      <div class="">
        <button type="submit" class="w-full  bg-amber-300 h-12 font-extrabold text-3xl text-black">{{ buttonText
          }}</button>
      </div>

    </form>

    <div class="mb-4 h-12 text-center text-white">
      {{ responseMessage }}
    </div>
  </div>

</template>

<style scoped>
.fields {
  @apply bg-blue-950 placeholder-white text-white outline-none px-1 border-b min-h-12
}
</style>