<script setup lang="js">
import { useSlideInMenu } from '../../stores/useSlideInMenu';
import {useWindowSize} from "@/composables/useWindowSize"
const {largeWindow, mediumWindow, smallWindow} = useWindowSize();

const emit = defineEmits(['open','close'])

defineExpose({
  open,close
})

const hamburger = ref(null);
const slideIn = ref(null);


const active = ref(false)

function open(){
   active.value = true;
   emit('open')
   slideIn.value.open()
   hamburger.value.synchronizeState(active.value)
 
}

function close(){
   active.value = false;
   emit('close')
   slideIn.value.close()
   hamburger.value.synchronizeState(active.value)
  
}

function toggle(){
   active.value = !active.value;
}
</script>
<template>
  <div>
    <div v-if="!largeWindow" class="absolute top-1 right-2 z-[999]">
      <HeaderHamburger ref="hamburger" @open="open" @close="close" class="" />
    </div>
    <div class="w-screen">
      <HeaderSlideInMenu ref="slideIn" @close="close" />
    </div>
  </div>
</template>
