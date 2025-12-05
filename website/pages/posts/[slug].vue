<script setup lang="js">
import axios from "axios"
import {useRoute } from "vue-router"
import { useWpPosts } from '~/stores/useWpPosts'
import { useHTMLContent }  from '~/composables/useHTMLContent'
const route = useRoute();
const slug = ref(String)
const wpPosts = useWpPosts();
const post = ref(null);
const heading = ref(null)
defineProps({
  category: String,
})

const html = useHTMLContent();

onMounted(async() =>{

    slug.value = route.params.slug
    post.value = await wpPosts.getPost({category: route.query.categories,slug:slug.value})
  console.log(`query is ${route.query.category} post`)

})

</script>
<template>

<div v-if="post">
 <PostContent :post="post"/>
</div>
   
</template>
