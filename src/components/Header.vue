<script setup lang="ts"></script>

<template>
  <header>
    <RouterLink to="/">Homepage</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/builder">Team Builder</RouterLink>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid black;
}

header a {
  width: 10rem;
  color: floralwhite;
  text-decoration: none;
  font-weight: bolder;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  transition: color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    color: navajowhite;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>
