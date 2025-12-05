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
import { useUtils } from '@/composables/useUtils'

const props = defineProps({
  category: String,
  slug: String,
})

defineExpose({

})

const route = useRoute();
const router = useRouter();
const { smallWindow, mediumWindow, largeWindow } = useWindowSize();
const scroll = useScrollHandler();

const wpPosts = useWpPosts();
const html = useHTMLContent();
const utils = useUtils();
//

const imageList = ref([]);
const slider = ref(null)

const fullScreenElement = ref(null);
const fullScreenImage = ref(null)

onMounted(async () => {
  const response = await wpPosts.getPost({ category: props.category, slug: props.slug });
  let images = html.extractImageUrls(response.content)
  images = images.map(img => utils.setImageSize(img, 512))

  imageList.value = [...imageList.value, ...images];

})

onUnmounted(() => {

})

function closeFullScreenElement() {
  fullScreenImage.value = null;
}

function openInFullScreen(image) {
  fullScreenImage.value = image;
}


</script>
<template>
  <div class="w-full px-8">
    
    <FullScreenElement v-if="fullScreenImage" @close="closeFullScreenElement" ref="fullScreenElement">
      <img :src="fullScreenImage" class="w-full h-full object-contain" alt="">
    </FullScreenElement>
  
    <Slider ref="slider" v-if="imageList.length > 0" class="h-72">
      <div v-for="image in imageList" :key="image" @click="openInFullScreen(utils.setImageSize(image, 2048))"
        class="ratio h-72">
        <div class="w-full h-2/3">
          <img :src="image" class="object-cover h-full w-full" alt="" />
        </div>
        <div class="h-1/3 flex justify-center items-center">
          <div class="px-4 overflow-hidden overflow-ellipsis">
            <span class="whitespace-nowrap"> Some textssssss</span>
          </div>
        </div>
      </div>
    </Slider>

    <div v-else class="flex justify-center items-center h-72">
      <GadgetsLoader />
    </div>

    <div class="flex justify-between w-full">
      <div>
        <button @mousedown="slider.moveRight(1)" class="border-4 p-4">
          <i class="bi bi-arrow-left text-black"></i>
        </button>
      </div>
      <div>
        <button @mousedown="slider.moveLeft(1)" class="border-4 p-4">
          <i class="bi bi-arrow-right text-black"></i>
        </button>
      </div>
    </div>

  </div>
</template>
<style scoped>
.ratio {
  aspect-ratio: 10 / 10;
}
</style>
