<script setup lang="ts">
interface Props {
  variant?: 'add' | 'edit' | 'view'
  title?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'view'
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    @click="$emit('click')"
    :title="title"
    :class="[
      'rounded-full flex items-center justify-center w-6 h-6 shrink-0 transition-colors',
      {
        'bg-negro-primario text-blanco-primario hover:bg-gray-800': variant === 'add',
        'bg-blanco-primario text-negro-primario hover:bg-gray-100': variant === 'edit' || variant === 'view'
      }
    ]"
  >
    <!-- Add icon -->
    <UiIconPlus v-if="variant === 'add'" size="sm" />
    <!-- Edit icon -->
    <UiIconEdit v-else-if="variant === 'edit'" />
    <!-- View icon -->
    <UiIconEye v-else />
  </button>
</template>
