<script setup lang="ts">
defineProps<{
  size?: "sm" | "md" | "lg";
}>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.5"
    :class="{
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md' || !size,
      'w-6 h-6': size === 'lg',
    }"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
</template>
