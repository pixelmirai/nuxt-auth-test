// stores/useSlideInMenu.js
import { defineStore } from 'pinia';

export const useSlideInMenu = defineStore('slideInMenu', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    openMenu() {
      this.isOpen = true;
  
    },
    closeMenu() {
      this.isOpen = false;
    
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  }
});
