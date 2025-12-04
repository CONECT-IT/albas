<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    :class="{
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md' || !size,
      'w-6 h-6': size === 'lg'
    }"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 7.5V6a2.25 2.25 0 0 1 2.25-2.25h10.5L21 8v10.5A2.25 2.25 0 0 1 18.75 20.75H5.25A2.25 2.25 0 0 1 3 18.75v-11.25Z"
    />
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V8.25H7.5V3.75" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75v6" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15.75h6" />
  </svg>
</template>
