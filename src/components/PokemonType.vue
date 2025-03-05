<template>
  <div :class="{
    fire: props.type === 'fire',
    fighting: props.type === 'fighting',
    water: props.type === 'water',
    electric: props.type === 'electric',
    grass: props.type === 'grass',
    ice: props.type === 'ice',
    poison: props.type === 'poison',
    ground: props.type === 'ground',
    flying: props.type === 'flying',
    psychic: props.type === 'psychic',
    bug: props.type === 'bug',
    rock: props.type === 'rock',
    ghost: props.type === 'ghost',
    dragon: props.type === 'dragon',
    dark: props.type === 'dark',
    steel: props.type === 'steel',
    fairy: props.type === 'fairy',
    normal: props.type === 'normal',
  }">
    <span>{{ props.type }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string }>()
</script>

<style scoped>
div {
  width: 66px;
  height: 20px;
  font-family: monospace;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  color: whitesmoke;
  border-radius: 5px;
  border: 1px solid black;
  text-shadow: 0px 0px 10px black;

  .normal {
    background-color: rgb(170, 170, 153);
  }

  .fire {
    background-color: rgb(255, 68, 34);
  }

  .water {
    background-color: rgb(51, 153, 255);
  }

  .electric {
    background-color: rgb(255, 204, 51);
  }

  .grass {
    background-color: rgb(119, 204, 85);
  }

  .ice {
    background-color: rgb(102, 204, 255);
  }

  .fighting {
    background-color: rgb(150, 68, 54);
  }

  .poison {
    background-color: rgb(170, 85, 153);
  }

  .ground {
    background-color: rgb(221, 187, 85);
  }

  .flying {
    background-color: rgb(136, 153, 255);
  }

  .psychic {
    background-color: rgb(255, 85, 153);
  }

  .bug {
    background-color: rgb(170, 187, 34);
  }

  .rock {
    background-color: rgb(187, 170, 102);
  }

  .ghost {
    background-color: rgb(102, 102, 187);
  }

  .dragon {
    background-color: rgb(119, 102, 238);
  }

  .dark {
    background-color: rgb(119, 85, 68);
  }

  .steel {
    background-color: rgb(170, 170, 187);
  }

  .fairy {
    background-color: rgb(238, 153, 238);
  }
}
</style>
