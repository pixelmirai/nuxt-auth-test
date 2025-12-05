<script setup lang="js">
import axios from "axios";
import {useRoute } from "vue-router"
import {useRouter} from 'vue-router'
import { formatDistanceToNow } from 'date-fns';
import {useWindowSize} from "@/composables/useWindowSize";
import {useInView} from "@/composables/useInView";
import {useScrollHandler} from "@/composables/useScrollHandler"
import { useHTMLContent }  from '~/composables/useHTMLContent'
import { useWpPosts } from '~/stores/useWpPosts'
import {useUtils} from '@/composables/useUtils'

const props = defineProps({

})

const emit = defineEmits([])

defineExpose({

})

const utils = useUtils();
const route = useRoute();
const router = useRouter();
const {smallWindow, mediumWindow, largeWindow} = useWindowSize();
const scroll = useScrollHandler();


const wpPosts = useWpPosts();
const html = useHTMLContent();

//

const mobileMode = ref(false)

onMounted(()=>{
  
})

onUnmounted(() => {

})




</script>

<template>
<div class="min-w-[400px] border-6 border-black">
  <div class="flex justify-start gap-56 px-2 items-end bg-black h-16 ">
    <div @mousedown="router.push('/')" class="logo flex justify-center items-center h-full   cursor-pointer" >
        <img class="max-h-full " src="@/assets/images/images.png" alt="">
    </div>
    <div v-if="largeWindow" class="flex justify-center items-end h-full w-full">
      <HeaderNavLinks class="text-white text-3xl max-w-2x w-full " />
    </div>   
  </div>
   <HeaderMobileMenu ref="mobileMenu" v-if="!largeWindow" />
   </div>

</template>
