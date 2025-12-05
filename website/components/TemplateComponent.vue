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

})

const emit = defineEmits([])

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

onMounted(() => {

})

onUnmounted(() => {

})




</script>
<template>
    <div class="min-h-1 flex justify-center items-center p-2 border">
        <div class="flex flex-wrap justify-evenly items-center gap-4 h-4/5 w-full ">
            <div class="h-36 flex flex-grow justify-center items-center min-w-[350px] border-4 ">

            </div>
        </div>
    </div>
</template>
<style scoped>
.background-image {
  background-image: url('https://c02.purpledshub.com/uploads/sites/48/2023/02/why-sky-blue-2db86ae.jpg?w=1410&webp=1'); /* Set your image URL here */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Do not repeat the background */
  background-size: cover; /* Scale the background to be as large as possible so that the background area is completely covered by the background image */

}
</style>