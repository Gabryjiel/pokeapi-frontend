<template>
  <div ref="slider" class="custom-slider minmax">
    <div class="minmax-indicator"></div>
    <input
      ref="input-min"
      type="range"
      name="min"
      :min="props.min"
      :max="props.max"
      :value="props.lowerValue"
      :step="props.step"
      @change="onInput"
    />
    <input
      ref="input-max"
      type="range"
      name="max"
      :min="props.min"
      :max="props.max"
      :value="props.higherValue"
      :step="props.step"
      @change="onInput"
    />
  </div>
  <div class="minmax-inputs">
    <input type="number" :step="step" v-model="sliderMinValue" />
    <input type="number" :step="step" v-model="sliderMaxValue" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from 'vue';

const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  lowerValue: {
    type: Number,
    default: 10,
  },
  higherValue: {
    type: Number,
    default: 90,
  },
});

const emit = defineEmits<{
  (e: 'change:min', value: number): void;
  (e: 'change:max', value: number): void;
}>();

const sliderRef = useTemplateRef<HTMLDivElement>('slider');
const inputMin = useTemplateRef<HTMLInputElement>('input-min');
const inputMax = useTemplateRef<HTMLInputElement>('input-max');
const sliderMinValue = ref(props.lowerValue);
const sliderMaxValue = ref(props.higherValue);

const getPercent = (value: number, min: number, max: number) => {
  return ((value - min) / (max - min)) * 100;
};

const sliderDifference = computed(() => {
  return Math.abs(sliderMaxValue.value - sliderMinValue.value);
});

const setCSSProps = (left: number, right: number) => {
  if (sliderRef.value === null) {
    return;
  }

  sliderRef.value.style.setProperty('--progressLeft', `${left}%`);
  sliderRef.value.style.setProperty('--progressRight', `${right}%`);
};

watchEffect(() => {
  if (!sliderRef.value) {
    return;
  }

  emit('change:min', sliderMinValue.value);
  emit('change:max', sliderMaxValue.value);

  const leftPercent = getPercent(sliderMinValue.value, props.min, props.max);
  const rightPercent = 100 - getPercent(sliderMaxValue.value, props.min, props.max);

  setCSSProps(leftPercent, rightPercent);
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target.name === 'min') {
    target.valueAsNumber > sliderMaxValue.value
      ? (target.valueAsNumber = sliderMaxValue.value)
      : (sliderMinValue.value = parseFloat(target.value));
  }

  if (target.name === 'max') {
    target.valueAsNumber < sliderMinValue.value
      ? (target.valueAsNumber = sliderMinValue.value)
      : (sliderMaxValue.value = parseFloat(target.value));
  }
};
</script>

<style scoped>
.custom-slider {
  --trackHeight: 0.35rem;
  --thumbRadius: 1rem;
}

/* style the input element with type "range" */
.custom-slider input[type='range'] {
  position: relative;
  appearance: none;
  background: none;
  border-radius: 999px;
  z-index: 0;
  height: 100%;
  pointer-events: none;
}

/* ::before element to replace the slider track */
.custom-slider input[type='range']::before {
  content: '';
  display: block;
  position: absolute;
  width: var(--ProgressPercent, 100%);
  height: 100%;
  background: #00865a;
  border-radius: 999px;
}

/* `::-webkit-slider-runnable-track` targets the track (background) of a range slider in chrome and safari browsers. */
.custom-slider input[type='range']::-webkit-slider-runnable-track,
  /* `::-moz-range-track` targets the track (background) of a range slider in Mozilla Firefox. */
  .custom-slider.default input[type='range']::-moz-range-track {
  appearance: none;
  background: #005a3c;
  height: var(--trackHeight);
  border-radius: 999px;
}

.custom-slider input[type='range']::-webkit-slider-thumb {
  position: relative;
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
  background: #005a3c;
  border: 1px solid #00865a;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}

.custom-slider input[type='range']::-moz-range-thumb {
  position: relative;
  box-sizing: border-box;
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
  background: #005a3c;
  border: 1px solid #00865a;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}

.custom-slider.minmax {
  position: relative;
  height: var(--trackHeight);
  background: #005a3c;
  border-radius: 999px;
  margin: 0.5rem 0;
  --progressLeft: 0%;
  --progressRight: 0%;
}

.custom-slider .minmax-indicator {
  position: absolute;
  height: 100%;
  pointer-events: none;
  left: var(--thumbRadius);
  right: var(--thumbRadius);
}

.custom-slider .minmax-indicator::before {
  content: '';
  position: absolute;
  background: #00865a;
  height: 100%;
  left: var(--progressLeft);
  right: var(--progressRight);
}

.custom-slider.minmax input[type='range'] {
  position: absolute;
  width: calc(100% - var(--thumbRadius));
}

.custom-slider.minmax input[type='range'][name='max'] {
  left: var(--thumbRadius);
}

.custom-slider.minmax input[type='range']::-webkit-slider-runnable-track {
  background: none;
}

.custom-slider.minmax input[type='range']::before {
  display: none;
}

.minmax-inputs {
  display: flex;
  justify-content: space-between;
}

.minmax-inputs input {
  width: 50px;
}
</style>
