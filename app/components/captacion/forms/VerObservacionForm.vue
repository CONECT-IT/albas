<script setup lang="ts">
const props = defineProps<{
  lead?: any;
  cita?: any;
  cliente?: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

const observacion = computed(
  () => props.lead?.observacion || props.cita?.observacion || props.cliente?.observacion || null,
);
</script>

<template>
  <UiBaseModal :show="true" title="Observaciones" size="md" @close="emit('close')">
    <div v-if="observacion" class="bg-gray-50 rounded-lg p-4">
      <p class="text-gray-700 whitespace-pre-wrap">{{ observacion }}</p>
    </div>

    <div v-else class="py-8 text-center text-gray-500">No hay observaciones registradas</div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')"> Cerrar </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
