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

defineExpose({

})

const route = useRoute();
const router = useRouter();
const { smallWindow, mediumWindow, largeWindow } = useWindowSize();
const scroll = useScrollHandler();

const wpPosts = useWpPosts();
const html = useHTMLContent();
//
const myel = ref(null);


onMounted(() => {

})

onUnmounted(() => {

})

const social = ref([
  {
    title: "youtube",
    icon: "bi bi-youtube",
    url: "youtube.com",
  },
  {
    title: "facebook",
    icon: "bi bi-facebook",
    url: "facebook.com",
  },
  {
    title: "instagram",
    icon: "bi bi-instagram",
    url: "instagram.com",
  },

])

const phone = ref([
  {
    title: "Phone Contact",
    href: "tel:+1234567890",
    icon: "bi bi-telephone"
  },
  {
    title: "WhatsApp Contact",
    href: `https://wa.me/1234567890
    ?text=${encodeURIComponent("Hello, I'm interested in your services.")}`,
    icon: "bi bi-whatsapp"
  }
]);


</script>
<template>

  <div class="sticky bottom-0 bg-stone-900 min-h-36 flex justify-center items-center px-2 py-12 border">
    <div class="flex flex-wrap justify-evenly items-center gap-4 h-4/5 w-full bg-stone-600">
      <div class="h-36 flex-grow min-w-[400px] border-4 ">

      </div>
      <div class="h-36 flex-grow min-w-[400px] border-4 ">

      </div>
      <div class="h-36 flex-grow min-w-[400px] border-4 ">

      </div>
      <div class="h-36 flex-grow min-w-[400px] border-4 ">

      </div>

    </div>
  </div>
</template>
