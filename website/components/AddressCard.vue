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

onMounted(() => {

})

onUnmounted(() => {

})

const company = {
  name: 'Acme Corp',
  address: '123 Elm Street, Metropolis, NY 10101, USA',
  email: 'contact@acmecorp.com',
  phone: '+1-555-1234'
};


</script>
<template>
  <div
    class="flex justify-center items-center border-4 border-black 0 border- bg-white rounded-lg shadow-md overflow-hidden ">
    <div class="p-6">
      <h2 class="text-lg font-bold text-gray-900">{{ company.name }}</h2>
      <div class="mt-4 text-gray-600">
        <p>{{ company.address }}</p>
        <p><a href="mailto:{{ company.email }}" class="text-blue-500 hover:text-blue-700">{{ company.email }}</a></p>
        <p><a href="tel:{{ company.phone }}" class="text-blue-500 hover:text-blue-700">{{ company.phone }}</a></p>
      </div>
    </div>
  </div>
</template>
