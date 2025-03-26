<template>
  <main>
    <slot></slot>
    <aside>
      <h3>Filters</h3>
      <slot name="aside"></slot>
    </aside>
  </main>
</template>

<script setup lang="ts"></script>
<style scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 1rem;
  gap: 1rem;
  overflow: hidden;
}

aside {
  width: 20rem;
  height: 100%;
  border: 3px solid black;
  border-radius: 10px;
  overflow: hidden;
  background-color: whitesmoke;
  padding: 1rem;
}

h3 {
  font-weight: bolder;
  font-size: larger;
  padding-bottom: 1rem;
}
</style>
