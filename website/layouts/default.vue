<script setup lang="js">

</script>

<template>
<div>
  <header class="sticky top-0 z-30">
      <HeaderNavBar/>
  </header>
   
  <main class="min-h-[90vh]">
    <slot></slot>
  </main>
  <footer>
    <FooterContent/>
  </footer>
</div>


</template>