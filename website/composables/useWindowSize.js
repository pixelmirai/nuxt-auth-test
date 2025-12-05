import { ref, onMounted, onUnmounted, computed } from 'vue';

export function useWindowSize() {
  const windowWidth = ref(process.client ? window.innerWidth : 0);
  const windowHeight = ref(process.client ? window.innerHeight : 0);

  const extraSmall = ref(0);
  const small = ref(475);
  const medium = ref(768);
  const large = ref(1024);
  const extraLarge = ref(1280);

  const extraSmallWindow = computed(() => windowWidth.value < small.value);
  const smallWindow = computed(() => windowWidth.value < medium.value);
  const mediumWindow = computed(() => windowWidth.value >= medium.value && windowWidth.value < large.value);
  const largeWindow = computed(() => windowWidth.value >= large.value);
  const extraLargeWindow = computed(() => windowWidth.value >= extraLarge.value);

  function update() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  }

  onMounted(() => {
    if (process.client) {
      window.addEventListener('resize', update);
      update(); // Call update initially to set to the current size
    }
  });

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', update);
    }
  });

  return {
    windowWidth,
    windowHeight,
    extraSmallWindow,
    smallWindow,
    mediumWindow,
    largeWindow,
    extraLargeWindow,
  };
}
