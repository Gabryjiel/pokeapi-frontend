<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import OmniboxSuggestionGroup from './OmniboxSuggestionGroup.vue';
import OmniboxSuggestion from './OmniboxSuggestion.vue';
import { searchAbilities, searchPokemons, type Suggestion } from '@/lib/listHelpers';

type SuggestionMap = {
  pokemons: Suggestion[];
  abilities: Suggestion[];
}

const isOmniboxFocused = ref(false);
const omniboxContent = ref('');
const suggestionGroups: SuggestionMap = reactive({
  pokemons: [],
  abilities: [],
});

const suggestionCount = computed(() =>
  suggestionGroups.pokemons.length + suggestionGroups.abilities.length
)

const handleOmniboxChange = (event: Event) => {
  const currentTarget = event.currentTarget as HTMLInputElement;
  omniboxContent.value = currentTarget.value;
}

watch(omniboxContent, async (content) => {
  if (content.length === 0) {
    let key: keyof typeof suggestionGroups
    for (key in suggestionGroups) {
      suggestionGroups[key] = [];
    }
    return
  }

  suggestionGroups.pokemons = await searchPokemons(content)
  suggestionGroups.abilities = await searchAbilities(content)
});

</script>

<template>
  <div id="omnibox">
    <input type="text" placeholder="SEARCH" :value="omniboxContent" @input="handleOmniboxChange"
      @focus="isOmniboxFocused = true" @blur="isOmniboxFocused = false" />
    <ul id="suggestions" v-if="suggestionCount > 0">
      <OmniboxSuggestionGroup href="/pokemons" text="Pokemons" :isVisible="suggestionGroups.pokemons.length > 0">
        <OmniboxSuggestion v-for="suggestion in suggestionGroups.pokemons" :key="suggestion.slug"
          :content="suggestion.name" :href="`/pokemons/${suggestion.id}`" />
      </OmniboxSuggestionGroup>

      <OmniboxSuggestionGroup href="/abilities" text="Abilities" :isVisible="suggestionGroups.abilities.length > 0">
        <OmniboxSuggestion v-for="suggestion in suggestionGroups.abilities" :key="suggestion.slug"
          :content="suggestion.name" :href="`/abilities/${suggestion.id}`" />
      </OmniboxSuggestionGroup>
    </ul>
  </div>
</template>

<style scoped>
#omnibox {
  width: 640px;
  height: 48px;
  position: relative;

  input {
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: x-large;
    border: 3px solid black;
    border-radius: 10px;

    &:focus {
      border-color: red;
      outline: none
    }
  }
}

#suggestions {
  position: absolute;
  top: calc(100% + 2px);
  width: 100%;
  max-height: 70vh;
  background-color: lightgray;
  border: 3px solid black;
  border-radius: 10px;
  overflow-y: scroll;
  padding-top: 5px;
}
</style>
