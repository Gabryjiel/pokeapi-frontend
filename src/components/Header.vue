<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Omnibox from './Omnibox/Omnibox.vue';
</script>

<template>
  <header>
    <div>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/builder">Builder</RouterLink>
    </div>
    <div class="right">
      <div class="omnibox-container">
        <Omnibox />
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid black;
  padding: 0px 10px;

  >div {
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1 0 0;
  }
}

header a {
  width: 5rem;
  color: floralwhite;
  text-decoration: none;
  font-weight: bolder;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-left: 1px solid black;
  border-right: 1px solid black;

  transition: color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    color: navajowhite;
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.right {
  display: flex;
  justify-content: end;
}

.omnibox-container {
  width: 400px;
}
</style>
