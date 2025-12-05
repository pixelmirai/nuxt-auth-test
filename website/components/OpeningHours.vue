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

const openingHours = {
  Monday: '9:00 AM - 5:00 PM',
  Tuesday: '9:00 AM - 5:00 PM',
  Wednesday: '9:00 AM - 5:00 PM',
  Thursday: '9:00 AM - 5:00 PM',
  Friday: '9:00 AM - 5:00 PM',
  Saturday: '10:00 AM - 2:00 PM',
  Sunday: 'Closed'
};

</script>


<template>
  <div class="min-w-[350px] rounded overflow-hidden shadow-lg bg-white p-4">
    <div class="font-bold text-xl mb-2">Opening Hours</div>
    <ul class="">
      <li v-for="(hours, day) in openingHours" :key="day" class="flex justify-between mb-1">
        <div>
          <strong>{{ day }}:</strong>
        </div>
        <div>
          <span> {{ hours }}</span>
        </div>

      </li>
    </ul>
  </div>
</template>
