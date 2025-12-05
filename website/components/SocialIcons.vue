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




</script>
<template>
  <div class="flex justify-center space-x-4 mt-4 text-4xl border border-black">
    <a href="https://www.facebook.com" target="_blank" class="text-blue-600 hover:text-blue-800">
      <i class="bi bi-facebook"></i>
      <span class="sr-only">Facebook</span>
    </a>
    <a href="https://www.x.com" target="_blank" class="text-black">
      <i class="bi bi-twitter-x"></i> <!-- Icon will be updated when available -->
      <span class="sr-only">X</span>
    </a>
    <a href="https://www.instagram.com" target="_blank" class="text-pink-600 hover:text-pink-800">
      <i class="bi bi-instagram"></i>
      <span class="sr-only">Instagram</span>
    </a>
    <a href="https://www.linkedin.com" target="_blank" class="text-blue-700 hover:text-blue-900">
      <i class="bi bi-linkedin"></i>
      <span class="sr-only">LinkedIn</span>
    </a>
  </div>
</template>