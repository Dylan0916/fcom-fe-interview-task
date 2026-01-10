<template>
  <div class="mt-8 text-gray-200 text-base flex items-center gap-1">
    <span>Selected Odds:</span>
    <span>{{ displayText }}</span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  minOdds: number
  maxOdds: number
}

const props = defineProps<Props>()

const isRange = computed(() => props.minOdds !== props.maxOdds)
const displayText = computed(() => (isRange.value ? `${props.minOdds}~${props.maxOdds}` : props.minOdds))
</script>
