<script setup lang="js">
import {useWpPosts} from '~/stores/useWpPosts'
import {useHTMLContent} from "~/composables/useHTMLContent"

defineExpose({
  moveLeft,
  moveRight,
  move
})

//

const contentContainer = ref(null)
const sliderContainer = ref(null);
const sliderContent = ref(null);
const isDragging = ref(false);
const startPosition = ref(0);
const currentPosition = ref(0);
const lastPosition = ref(0);
const velocity = ref(0);
const lastTime = ref(0);
const inertiaActive = ref(false)

//styling
const sliderElementOverflow = ref(50)
const scrollInterval = ref(null);

//smooth slide props
const transition = ref(false)
const transitionTimeout = ref(null)


//utils
function notFilled() {
  return contentContainer.value.clientWidth < sliderContainer.value.clientWidth
}

function adjustWithinBounds(current, adjustment, overflow = 0) {

  const lowerBound = -(contentContainer.value.clientWidth - sliderContainer.value.clientWidth) - overflow
  const upperBound = 0 + overflow;

  let newValue = current + adjustment;
  newValue = Math.max(lowerBound, Math.min(upperBound, newValue));
  let adjustedAmount = newValue - current;
  return adjustedAmount;
}

//visual features
function addSmoothSlide(time = 200) {
  clearTimeout(transitionTimeout.value)
  transition.value = true
  transitionTimeout.value = setTimeout(() => {
    transition.value = false
  }, time);
}

function readjustSlider() {

  const overflow = sliderElementOverflow.value;
  const rightSide = -(contentContainer.value.clientWidth - sliderContainer.value.clientWidth)
  if (currentPosition.value < rightSide) {
    currentPosition.value = rightSide;
    return
  }
  const leftSide = 0;
  if (currentPosition.value > leftSide) {
    currentPosition.value = 0;
  }
}

//manual movement

function moveLeft(amount = 1) {
  if (notFilled()) return;
  addSmoothSlide();
  const distance = sliderContent.value.clientWidth * amount
  currentPosition.value += adjustWithinBounds(currentPosition.value, -distance);

}

function moveRight(amount = 1) {
  if (notFilled()) return;
  addSmoothSlide();
  const distance = sliderContent.value.clientWidth * amount;
  currentPosition.value += adjustWithinBounds(currentPosition.value, distance);

}

function move(amount = 0) {
  if (notFilled()) return;
  const distance = sliderContent.value.clientWidth * amount
  currentPosition.value += adjustWithinBounds(currentPosition.value, distance);
}


//dragging

function startDragging(event) {

  if (notFilled()) {
    return
  }

  isDragging.value = true;
  startPosition.value = event.type.includes('mouse') ? event.pageX : event.touches[0].pageX;

  lastPosition.value = startPosition.value;
  lastTime.value = performance.now();
  velocity.value = 0;

  document.addEventListener('mousemove', dragging);
  document.addEventListener('touchmove', dragging);

}

function dragging(event) {

  if (!isDragging.value) return;
  const x = event.type.includes('mouse') ? event.pageX : event.touches[0].pageX;
  const delta = x - lastPosition.value;
  lastPosition.value = x;
  currentPosition.value += adjustWithinBounds(currentPosition.value, delta, sliderElementOverflow.value);

  // Calculate velocity for inertia
  const now = performance.now();
  const timeDelta = now - lastTime.value;
  velocity.value = delta / timeDelta;
  lastTime.value = now;
}

function stopDragging() {

  if (!isDragging.value) return;

  isDragging.value = false;
  document.removeEventListener('mousemove', dragging);
  document.removeEventListener('touchmove', dragging);

  // Apply inertia

  const inertia = () => {
    inertiaActive.value = true;

    const inertiaFactor = velocity.value * 5
    const friction = 0.99

    currentPosition.value += adjustWithinBounds(currentPosition.value, inertiaFactor, sliderElementOverflow.value);
    velocity.value *= friction;

    if (currentPosition.value >= 0 ||
        currentPosition.value <= -(contentContainer.value.clientWidth - sliderContainer.value.clientWidth)) {
      readjustSlider();
      return;
    }

    if (Math.abs(velocity.value) > 0.01) {
      requestAnimationFrame(inertia);
    } else {
      inertiaActive.value = false;
    }
  };
  requestAnimationFrame(inertia);
  if (!inertiaActive.value) {
    readjustSlider();
  }
}

//mousewheel

function handleWheel(event) {
  if (event.deltaX > 0) {
    moveLeft(0.05)
  } else if (event.deltaX < 0) {
    moveRight(0.05);
  }
};


//watch

watch(inertiaActive, () => {
  if (!inertiaActive.value) {
    readjustSlider();
  }
})

watch(transition, () => {

})


</script>

<template>
  <div ref="sliderContainer" class="slider-container  w-full  overflow-scroll"
       @mousedown="('startDragging')"
       @touchstart="(startDragging)"
       @mouseup="('stopDragging')"
       @mouseleave="('stopDragging')"
       @touchend="stopDragging"
       @mousewheel="handleWheel">
    <div ref="sliderContent" class=" "
         :class="{ 'slider-transition-slow': transition, 'slider-transition-fast': !transition }"
         :style="{ transform: `translateX(${currentPosition}px)` }" style="width: max-content">
      <div ref="contentContainer" class="flex flex-nowrap gap-5">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  overflow: hidden;
}

.slider-transition-slow {
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.slider-transition-fast {
  transition: transform 0.05s ease-out;
  will-change: transform;
}
</style>
