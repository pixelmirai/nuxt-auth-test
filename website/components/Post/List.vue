<script setup lang="js">
import axios from "axios"
import {useSlideInMenu} from '~/stores/useSlideInMenu'
import {useWpPosts} from '~/stores/useWpPosts'
import {onMounted, nextTick} from 'vue';
import {useWindowSize} from "@/composables/useWindowSize"
import {useInView, useNotInView} from "@/composables/useInView"
import {useScrollHandler} from "@/composables/useScrollHandler"
import ListContainerV1 from "~/components/Post/ListContainerV1.vue";
import ListContainerV2 from "~/components/Post/ListContainerV2.vue";

const props = defineProps({
  category: ""
})

const {largeWindow, mediumWindow, smallWindow} = useWindowSize();
const {create} = useScrollHandler();
const wpPosts = useWpPosts();

const postList = ref([])

const loaderInView = ref(true);
const hasMore = ref(true)

const listContainer = ref(null)

async function getPosts() {
  const response = await wpPosts.get(props.category)
  postList.value = response
  hasMore.value = [...response].length > 0
}

async function loadMore() {

  const response = await wpPosts.nextPage(props.category)
  postList.value = [...postList.value, ...response]
  hasMore.value = [...response].length > 0
  return [...response];
}

async function handleLoading() {
  while (loaderInView.value && hasMore.value) {
    loaderInView.value = true;
    let loaded = await loadMore();
    hasMore.value = loaded.length > 0
    if (!loaderInView.value) {
      break;
    }
  }
}

onMounted(async () => {
  await getPosts()
  await nextTick(async () => {
    await handleLoading()
  })
})

watch(loaderInView, async () => {
  await handleLoading();
})
watch(hasMore, () => {
  if (!hasMore.value) {
    listContainer?.value?.removeLoader()
  }
})

</script>
<template>
  <ListContainerV1
      ref="listContainer"
      :posts="postList"
      @loader-in-view="loaderInView = true"
      @loader-not-in-view="loaderInView=false"></ListContainerV1>

</template>
<style scoped>

</style>
