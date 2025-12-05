<script setup lang="js">
import { ref } from 'vue';
import axios from 'axios';
import { Loader } from '@googlemaps/js-api-loader'

const form = ref({
  email: '',
  name: '',
  message: ''
});



const mapContainer = ref(null);
const loc = ref("")

const mapSrc = ref("");

onMounted(() => {

})


</script>
<template>

<EmailForm/>


</template>

<style scoped>
.background-image {
  background-image: url('https://c02.purpledshub.com/uploads/sites/48/2023/02/why-sky-blue-2db86ae.jpg?w=1410&webp=1'); /* Set your image URL here */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Do not repeat the background */
  background-size: cover; /* Scale the background to be as large as possible so that the background area is completely covered by the background image */

}
</style>