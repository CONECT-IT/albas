<script setup lang="ts">
const props = defineProps<{
  cita?: any
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Gastos"
    size="md"
    @close="emit('close')"
  >
    <div class="py-8 text-center text-gray-500">
      Formulario de gastos en desarrollo
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cerrar
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
