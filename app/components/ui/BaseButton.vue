<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  rounded: false,
  disabled: false,
});
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'font-semibold transition-colors duration-150 shadow-md flex items-center justify-center gap-2',
      {
        'rounded-full': rounded,
        'rounded-lg': !rounded,
        'px-2 py-1 text-xs': size === 'sm',
        'px-4 py-2 text-sm': size === 'md',
        'px-6 py-3 text-base': size === 'lg',
        'bg-negro-primario text-blanco-primario hover:bg-gray-800': variant === 'primary',
        'bg-blanco-primario text-negro-primario border border-gray-200 hover:bg-gray-50':
          variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        'bg-transparent text-negro-primario hover:bg-gray-100': variant === 'ghost',
        'opacity-50 cursor-not-allowed': disabled,
      },
    ]"
  >
    <slot />
  </button>
</template>
