<script setup lang="js">
import axios from "axios";
import { useHTMLContent } from '~/composables/useHTMLContent'
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  post: Object
});

const html = useHTMLContent();

const h1 = ref([])
const img = ref([])
onMounted(async () => {
  h1.value = html.extractAll(props.post.content, 'h1')
  props.post.content = html.removeFirst(props.post.content, 'h1')
  img.value = html.extractImageUrls(props.post.content, 'img')
  props.post.content = html.addClassesToElements(props.post.content, 'img', 'min-w-full border-4 border-black my-8')
});

const formattedDate = computed(() => {
  if (!props.post.date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('default', options).format(new Date(props.post.date));
});


</script>

<template>
  <div class="">
    <div v-if="props.post" class="space-y-6 mt-12">
      <h1 class="text-4xl text-center font-bold text-gray-900">{{ props.post.title }}</h1>

      <p class="text-center text-gray-500 text-sm mt-2">{{ formattedDate }}</p>
      <div class="text-xl text-gray-700" v-if="h1.length > 0">
        <h2 class="font-semibold text-center">{{ h1[0] }}</h2>
      </div>
      <div>
        {{ props.post.category }}
      </div>
      <div class="flex justify-center px-9">
        <img :src="props.post.featured_image" alt="" class="rounded-lg w-full shadow-md" />
      </div>
      <div class="flex justify-center px-10">
        <div v-html="props.post.content" class="border-black ">
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">Loading post...</p>
    </div>
  </div>
</template>
