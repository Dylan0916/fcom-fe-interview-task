<template>
  <button :class="buttonClass" class="flex-1 px-4 py-2 rounded text-sm font-700 cursor-pointer text-black">{{ label }}: {{ odds }}</button>
</template>

<script lang="ts" setup>
export interface Props {
  label: string
  odds: number
  isSelected: boolean
  isInConflict: boolean
}

const props = defineProps<Props>()

const buttonClass = computed(() => {
  if (props.isInConflict) {
    return 'bg-red-400'
  }
  if (props.isSelected) {
    return 'bg-green-500'
  }
  return 'bg-gray-300'
})
</script>
