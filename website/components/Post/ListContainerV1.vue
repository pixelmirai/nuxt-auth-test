<script setup lang="js">
import axios from "axios";
import { useRoute } from "vue-router"
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns';
import { useWindowSize } from "@/composables/useWindowSize";
import { useInView,useNotInView } from "@/composables/useInView";
import { useScrollHandler } from "@/composables/useScrollHandler"
import { useHTMLContent } from '~/composables/useHTMLContent'
import { useWpPosts } from '~/stores/useWpPosts'
import { useUtils } from '@/composables/useUtils'

const props = defineProps({
  posts:Object,
})

const emit = defineEmits(["loader-in-view","loader-not-in-view"])

defineExpose({

})

const utils = useUtils();
const route = useRoute();
const router = useRouter();
const { smallWindow, mediumWindow, largeWindow } = useWindowSize();
const scroll = useScrollHandler();


const wpPosts = useWpPosts();
const html = useHTMLContent();

//

const loader = ref(null)
const loaderVisible = ref(false);
onMounted(() => {

  nextTick(()=>{
    //enableLazyLoad()
  })
})

onUnmounted(() => {

})




</script>

<template>
  <div class=" w-full ">
    <div class="thumbnail-grid">
      <div v-for="post in props.posts" :key="post.title">
        <PostPreviewV1 :post="post" class=""/>
      </div>
    </div>
<!--    <div ref="loader" class="flex justify-center  w-[100vw] ">-->
<!--      <GadgetsLoader  v-if="loaderVisible" />-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.thumbnail-grid {
  @apply grid grid-cols-1
  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3
  px-8 sm:px-8 md:px-12
  gap-12 my-4
}
</style>