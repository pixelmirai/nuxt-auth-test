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
//a
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
const mapSrc = ref("");

onMounted(() => {
     mapSrc.value = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2659.4985925698643!2d16.372971076748353!3d48.197011547021155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDjCsDExJzQ5LjIiTiAxNsKwMjInMzIuMCJF!5e0!3m2!1sde!2sat!4v1712876684257!5m2!1sde!2sat"
})

onUnmounted(() => {

})




</script>
<template>
     <iframe :src="mapSrc" class="" width="600" height="450" allowfullscreen="true" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>

</template>
