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

onMounted(() => {

})

onUnmounted(() => {

})

const contacts = [
  { name: 'John Doe', phone: '+1234567890', email: 'john.doe@example.com' },
  { name: 'Jane Smith', phone: '+0987654321', email: 'jane.smith@example.com' },
  { name: 'Alice Johnson', phone: '+1357924680', email: 'alice.johnson@example.com' },

];


</script>
<template>
  <div class="space-y-4  p-4 min-w-[350px]">
    <div v-for="(contact, index) in contacts" :key="index"
      class="p-5 max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-lg">

      <div class="flex flex-col items-center justify-center text-gray-700 ">

        <div class="block mt-1 text-lg leading-tight font-medium text-black">
          {{ contact.name }}
        </div>

        <div class="flex flex-col space-y-2 mt-2 text-sm text-gray-600">
          <a :href="`mailto:${contact.email}`" class="block hover:text-blue-600">
            {{ contact.email }}
          </a>
          <div class="flex items-center hover:text-blue-600">
            <div class="flex justify-around w-full">
              <div>
                <span> {{ contact.phone }}</span>
              </div>
              <a :href="`tel:${contact.phone}`"></a>
              <div class="border">
                <i class="bi bi-telephone-fill mr-2"></i>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
