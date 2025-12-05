<script setup lang="js">
import {useRoute, useRouter} from "vue-router"
import {useWindowSize} from "@/composables/useWindowSize";
import {useScrollHandler} from "@/composables/useScrollHandler"
import {useHTMLContent} from '~/composables/useHTMLContent'
import {useWpPosts} from '~/stores/useWpPosts'
import {useUtils} from '@/composables/useUtils'
import {useInView, useNotInView} from "~/composables/useInView.js";

const props = defineProps({})

const emit = defineEmits([])

defineExpose({})

const utils = useUtils();
const route = useRoute();
const router = useRouter();
const {smallWindow, mediumWindow, largeWindow} = useWindowSize();
const scroll = useScrollHandler();


const wpPosts = useWpPosts();
const html = useHTMLContent();

//

//loader stuff

const loader = ref(null);
const loaderInView = ref(false);
const showLoader = computed(()=>{return hasMorePosts.value})
const hasMorePosts = ref(true);

//

const category = ref("")
const perPage = ref(4)
const posts = ref([])

onMounted(() => {
  getPosts()
  watchLazyLoader();

})

onUnmounted(() => {

})

async function getPosts() {
  try {
    posts.value = await wpPosts.get(category.value, perPage.value);
    setTimeout(async()=>{
      if (loaderInView.value){
        console.log(` in getposts loader ${loaderInView.value}`)
        await loadMore();
      }
    },500 )
  } catch (error) {
    console.log(error)
  }
}

async function loadMore() {
  if (posts.value.length < 1) {
    return;
  }
  try {
    const response = await wpPosts.nextPage(category.value)
    hasMorePosts.value = response.length > 0
    posts.value = [...posts.value, ...response];
    setTimeout(async()=>{
      if (loaderInView.value && hasMorePosts.value) {
       //console.log(` in getPosts loader ${loaderInView.value}`)
        await loadMore();
      }
    },500)

  } catch (error) {
    console.log(error);
  }
}
const notInViewEmissions = ref(0)
async function watchLazyLoader() {
  useInView(loader.value, async () => {
    loaderInView.value = true
    await loadMore();
  })
  useNotInView(loader.value, () => {
    loaderInView.value = false
    notInViewEmissions.value++;
    console.log("not in view")
  },0.1)
}

</script>
<template>
  <div class="fixed top-24 bg-white">
    length {{posts.length}} inview {{loaderInView}} notinViews {{notInViewEmissions}}
  </div>


  <div>
    <PostListContainerV1 :posts class="mt-8 "/>
  </div>
  <div ref="loader" class="flex justify-center  w-[100vw] ">
    <GadgetsLoader v-if="showLoader"/>
  </div>
</template>
