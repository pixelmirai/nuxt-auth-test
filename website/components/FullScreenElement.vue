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
    content: Object
})

const emit = defineEmits(['close']);

defineExpose({

})

const route = useRoute();
const router = useRouter();
const { smallWindow, mediumWindow, largeWindow } = useWindowSize();
const scroll = useScrollHandler();

const wpPosts = useWpPosts();
const html = useHTMLContent();

//

const open = ref(true);

onMounted(() => {

})

onUnmounted(() => {

})

function close(event) {

    open.value = false;
    emit('close');
}


</script>
<template>
    <div v-if="open" class="absolute top-0 right-0 w-full h-full min-w-screen min-h-screen  z-[997] ">
        <div class="absolute top-0 right-0 w-screen h-screen opacity-50 z-[998] bg-black"></div>
        <div class="flex flex-col justify-center items-center h-full absolute top-0 w-full   px-4 z-[999]">

            <div class="flex justify-center items-center relative max-w-full max-h-full py-12">
                <button @click="close"
                    class="text-black text-4xl absolute bg-slate-600 hover:text-slate-300 -top-0 right-0 ">
                    <i class="bi bi-x-lg"></i>
                </button>
                <slot></slot>
            </div>
        </div>
    </div>
</template>
