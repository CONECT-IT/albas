<script setup lang="ts">
const props = defineProps<{
  cita?: any;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <UiBaseModal :show="true" title="Observación de la Cita" size="md" @close="emit('close')">
    <div v-if="cita?.observacion" class="bg-gray-50 rounded-lg p-4">
      <p class="text-gray-700 whitespace-pre-wrap">{{ cita.observacion }}</p>
    </div>

    <div v-else class="py-8 text-center text-gray-500">
      No hay observaciones registradas para esta cita
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')"> Cerrar </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
