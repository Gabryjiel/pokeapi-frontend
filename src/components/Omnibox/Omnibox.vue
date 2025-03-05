<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref, useTemplateRef, watch } from 'vue';
import OmniboxSuggestionGroup from './OmniboxSuggestionGroup.vue';
import OmniboxSuggestion from './OmniboxSuggestion.vue';
import { searchAbilities, searchPokemons, type Suggestion } from '@/lib/listHelpers';
import OmniboxPokemonSuggestion from './OmniboxPokemonSuggestion.vue';

type SuggestionMap = {
  pokemons: Suggestion[];
  abilities: Suggestion[];
}

const isOmniboxFocused = ref(false);
const omniboxContent = ref('');
const omniboxInputRef = useTemplateRef<HTMLInputElement>('omnibox-input')
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

const handleKeyboardEvent = (event: KeyboardEvent) => {
  if (event.key === 'k' && event.ctrlKey) {
    event.preventDefault()
    if (document.activeElement === omniboxInputRef.value) {
      omniboxInputRef.value?.blur()
      isOmniboxFocused.value = false
    } else {
      omniboxInputRef.value?.focus()
      isOmniboxFocused.value = true
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboardEvent);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardEvent);
})

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

provide('omnibox-content', omniboxContent)
</script>

<template>
  <div id="omnibox">
    <div class="keys" v-if="!isOmniboxFocused">
      Ctrl+K
    </div>
    <input type="text" placeholder="Search anything" :value="omniboxContent" @input="handleOmniboxChange"
      @focus="isOmniboxFocused = true" @blur="isOmniboxFocused = false" ref="omnibox-input" />
    <ul id="suggestions" v-if="suggestionCount > 0">
      <OmniboxSuggestionGroup href="/pokemons" text="Pokemons" :isVisible="suggestionGroups.pokemons.length > 0">
        <OmniboxPokemonSuggestion v-for="suggestion in suggestionGroups.pokemons" :key="suggestion.slug"
          :content="suggestion.name" :href="`/pokemons/${suggestion.id}`" :pokemon-id="suggestion.id" />
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
  width: 400px;
  height: 48px;
  position: relative;

  input {
    text-align: left;
    text-indent: 1rem;
    width: 100%;
    height: 100%;
    font-size: larger;
    border: 3px solid black;
    border-radius: 10px;
    background-color: lightsteelblue;
    color: darkslateblue;
    font-weight: 100;

    &:focus {
      border-color: darkslateblue;
      outline: none
    }
  }
}

.keys {
  position: absolute;
  right: 5%;
  top: 29%;
  padding: 5px 10px;
  border: 1px solid darkslateblue;
  color: darkslateblue;
  border-radius: 10%;
  display: flex;
  justify-content: flex;
  align-items: center;
  font-size: 11px;
  user-select: none;
}

#suggestions {
  position: absolute;
  top: calc(100% + 2px);
  min-width: 100%;
  max-width: 200%;
  max-height: 70vh;
  background-color: lightsteelblue;
  border: 3px solid darkslateblue;
  border-radius: 10px;
  overflow-y: scroll;
  padding-top: 5px;
}
</style>
