<template>
  <nav>
    <RouterLink to="/">
      <div class="header">
        <span>Homepage</span>
      </div>
    </RouterLink>

    <div class="omnibox-container">
      <Omnibox />
    </div>

    <SidebarGroup header-text="Builder">
      <SidebarElement label="Pokemon Builder" href="/builder/pokemons" />
      <SidebarElement label="Team Builder" href="/builder/teams" />
    </SidebarGroup>

    <SidebarGroup header-text="Resources">
      <SidebarElement label="Pokemons" href="/pokemons" />
      <SidebarElement label="Abilities" href="/abilities" />
      <SidebarElement label="Moves" href="/moves" />
      <SidebarElement label="Items" href="/items" />
      <SidebarElement label="Natures" href="/natures" />
      <SidebarElement label="Types" href="/types" />
    </SidebarGroup>
  </nav>
</template>

<script setup lang="ts">
import Omnibox from '../Omnibox/Omnibox.vue';
import SidebarElement from './SidebarElement.vue';
import SidebarGroup from './SidebarGroup.vue';
</script>

<style scoped>
a {
  text-decoration: none;
  color: steelblue;

  &:hover {
    filter: brightness(1.1);
  }
}

nav {
  height: 100%;
  width: 200px;
  display: flex;
  flex-direction: column;
  background-color: lightsteelblue;
  border-right: 2px solid black;
}

.header {
  width: 100%;
  height: 30px;
  text-align: center;
  font-weight: bolder;
  font-size: larger;
  display: flex;
  align-items: center;
  justify-content: center;
}

.omnibox-container {
  width: 100%;
  padding: 1rem;
}
</style>
