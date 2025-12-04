<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="emit('close')"
        />

        <!-- Modal container -->
        <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div
            :class="[
              'bg-white rounded-2xl p-8 shadow-2xl pointer-events-auto relative flex flex-col max-h-[90vh] overflow-y-auto',
              {
                'w-full max-w-sm': size === 'sm',
                'w-full max-w-md': size === 'md',
                'w-full max-w-lg': size === 'lg',
                'w-full max-w-2xl': size === 'xl'
              }
            ]"
            @click.stop
          >
            <!-- Close button -->
            <button
              class="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              @click="emit('close')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Header -->
            <div v-if="title" class="mb-6">
              <h2 class="text-2xl font-bold text-black">{{ title }}</h2>
              <p v-if="subtitle" class="text-gray-400 text-sm mt-1">{{ subtitle }}</p>
            </div>

            <!-- Content -->
            <slot />

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
