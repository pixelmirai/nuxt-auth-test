<script setup lang="js">
import axios from "axios";
import {useRoute} from "vue-router"
import {useRouter} from 'vue-router'
import {formatDistanceToNow} from 'date-fns';
import {useWindowSize} from "@/composables/useWindowSize";
import {useInView, useNotInView} from "@/composables/useInView";
import {useScrollHandler} from "@/composables/useScrollHandler"
import {useHTMLContent} from '~/composables/useHTMLContent'
import {useWpPosts} from '~/stores/useWpPosts'
import {useUtils} from '@/composables/useUtils'

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



const posts = ref([])
const searchInput = ref("")

const postContainer = ref(null)
const loader = ref(null);
const loaderVisible = computed(() => {
  return posts.value.length > 0 && hasMorePosts.value
});
const loaderInView = ref(false);
const hasMorePosts = ref(true);

onMounted(async () => {
  await nextTick(() => {
    watchLazyLoader()
  })
})

onUnmounted(async () => {

})

async function searchPosts() {
  posts.value = []
  posts.value = await wpPosts.search(searchInput.value, 2)
  loaderVisible.value = true;
  await searchMore();
}

async function searchMore() {
  try {
    if (posts.value.length < 1) {
      return
    }
    const response = await wpPosts.searchMore();
    hasMorePosts.value = response.length > 0;
    posts.value = [...posts.value, ...response];
    if (hasMorePosts.value && loaderInView.value) {
      await searchMore();
    }
  } catch (error) {
    console.error("An error occurred during loading:", error);
  }
}

async function watchLazyLoader() {
  useInView(loader.value, async () => {
    loaderInView.value = true
    await searchMore();
  })
  useNotInView(loader.value, () => {
    loaderInView.value = false
  },0.1)
}

</script>

<template>

  <div class=" ">
    <div class="flex justify-center w-full ">
      <div class="flex w-full lg:w-1/2 px-3">
        <div class="w-full">
          <input @keydown.enter="searchPosts" v-model="searchInput" type="text" class="w-full h-10 border-4"
                 placeholder="Search..."/>
        </div>
        <div class="flex items-center ">
          <button @click="searchPosts" class="bg-blue-500 p-2  ">Search</button>
        </div>
      </div>
    </div>
    <div>
      <PostListContainerV1

          ref="postContainer"
          :posts="posts"
      ></PostListContainerV1>
      <div ref="loader" class="flex justify-center  w-[100vw] ">
        <GadgetsLoader v-if="loaderVisible"/>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>