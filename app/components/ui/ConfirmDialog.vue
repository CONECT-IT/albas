<script setup lang="ts">
import { ref } from "vue";

interface Props {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "confirm" | "danger";
}

const props = withDefaults(defineProps<Props>(), {
  title: "¿Estás seguro?",
  message: "¿Deseas continuar con esta acción?",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  variant: "confirm",
});

const show = ref(false);
let resolvePromise: ((value: boolean) => void) | null = null;

const open = (): Promise<boolean> => {
  show.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

const confirm = () => {
  show.value = false;
  resolvePromise?.(true);
};

const cancel = () => {
  show.value = false;
  resolvePromise?.(false);
};

defineExpose({ open });
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="cancel" />

        <!-- Modal -->
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl p-6 w-80 text-center shadow-xl relative z-10" @click.stop>
            <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
            <p class="text-sm text-gray-600 mb-6">{{ message }}</p>

            <div class="flex justify-between gap-3">
              <button
                @click="cancel"
                class="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                {{ cancelText }}
              </button>

              <button
                @click="confirm"
                :class="[
                  'flex-1 px-4 py-2 rounded-lg transition-colors font-medium text-white',
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-negro-primario hover:bg-black',
                ]"
              >
                {{ confirmText }}
              </button>
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
