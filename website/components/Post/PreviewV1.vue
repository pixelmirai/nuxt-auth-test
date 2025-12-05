<script setup lang="js">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns';
import {useUtils} from "~/composables/useUtils.js";
const props = defineProps({
  post: Object
});

const router = useRouter();
const post = props.post;
const utils = useUtils()

const formattedDate = computed(() => {
  return formatDistanceToNow(new Date(props.post.date), { addSuffix: true });
});

function toPost() {
  console.log(`in list ${Object.keys(post.categories)}`)
  const categories = Object.keys(post.categories);
  router.push({path: `/posts/${props.post.slug}`,query: {categories: categories}});
}
</script>

<template>
  <div class="container flex flex-col ">

    <div @click="toPost" class="image-container flex justify-center items-center   h-2/3">
      <img v-if="post.featured_image" @click="toPost" :src="utils.setImageSizeV2(post.featured_image,512)" alt=""
        class="w-full h-full object-cover transition-all duration-500 hover:opacity-95  cursor-pointer" />
      <div v-else class="flex justify-center items-center w-full h-full bg-blue-950">
        <h1 class="text-5xl text-white font-extrabold">{{post.title}}</h1>
      </div>
    </div>

    <div class="flex flex-col justify-center h-1/3 px-4 border-b  ">
      <h1 @click="toPost"
        class="text-lg  hover:text-green-800 font-bold whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer">
        {{ post.title }}
      </h1>
      <div class="  ">
        <span @click="toPost" class="text-sm text-gray-500 hover:underline cursor-pointer">{{ formattedDate }}</span>
      </div>
    </div>

  </div>
</template>
<style scoped>
.container {
  aspect-ratio: 10 / 10;
}

.image-container {}

.title-container {}
</style>
