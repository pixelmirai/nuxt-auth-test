<script setup lang="js">
import axios from "axios";
import {useRoute} from "vue-router"
import {useRouter} from 'vue-router'
import {formatDistanceToNow} from 'date-fns';
import {useWindowSize} from "@/composables/useWindowSize";
import {useInView} from "@/composables/useInView";
import {useScrollHandler} from "@/composables/useScrollHandler"
import {useHTMLContent} from '~/composables/useHTMLContent'
import {useWpPosts} from '~/stores/useWpPosts'
import {useUtils} from "~/composables/useUtils.js";

const route = useRoute();
const router = useRouter();
const {smallWindow, mediumWindow, largeWindow} = useWindowSize();
const scroll = useScrollHandler();

const wpPosts = useWpPosts();
const html = useHTMLContent();
const utils =  useUtils()

const props = defineProps({
  post: Object
});


const post = props.post;

const excerptContainer = ref(null);
const excerptContainerWidth = ref(null);

const excerptLineClamp = computed(() => {
  return {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': Math.floor(excerptContainerWidth.value / 100) - 1,
    overflow: 'hidden'
  };
});
const formattedDate = computed(() => {
  return formatDistanceToNow(new Date(props.post.date), {addSuffix: true});
});


onBeforeMount(() => {

})

onMounted(() => {
  updateExcerptContainerWidth()
  window.addEventListener('resize', updateExcerptContainerWidth)
})

function updateExcerptContainerWidth() {
  excerptContainerWidth.value = excerptContainer.value ? excerptContainer.value.clientWidth : 0;
}

function extractExcerpt(post){
 return post.excerpt ? html.extractAll(post.excerpt, 'p')[0].replace("[&hellip;]", "") : ""
}

const lineClamp = computed(() => {

})


function toPost() {
  router.push(`/posts/${props.post.slug}`);
}
</script>
<template>

  <div class="    max-h-[30vh] w-full  flex  " style="aspect-ratio: 5 / 1;">

    <div class="flex justify-end   w-1/3 h-full">
      <div class=" w-full border-black " style="aspect-ratio: 1.618">
        <img v-if="post.featured_image" :src="utils.setImageSizeV2(post.featured_image,512)" class="h-full w-full object-right-top   object-contain" alt="">
        <div v-else class="w-full h-full bg-blue-950" ></div>
      </div>
    </div>


    <div class="flex flex-col justify-between w-2/3 h-full  px-2 py-4  ">
      <div class=" ">
        <h1 class=" sm:text-3xl text-2xl  font-semibold text-gray-800 mb-3 clamp-2 break-words">
          {{ post.title.length > 50 ? `${post.title}...` : post.title }}</h1>
      </div>
      <div ref="excerptContainer" class="text-gray-700   mb-4 break-words excerpt  "
           :style="excerptLineClamp"
      >
        <p class="h-full">
          {{ extractExcerpt(props.post) }}
          <span @click="toPost" class="hover:font-bold transition-all duration-200 cursor-pointer">...</span>
        </p>

      </div>
      <div class="flex justify-between items-center">
        <span @click="toPost" class="text-sm text-gray-600 hover:underline">{{ formattedDate }}</span>
        <button @click="toPost"
                class="px-4 py-2 bg-blue-500 text-white font-semibold text-xs rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Read more
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-ratio {
  aspect-ratio: 10 / 10;
}

.container-ratio {
  aspect-ratio: 1 / 1;
}


.clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}


.image-container {
}

.title-container {
}
</style>
