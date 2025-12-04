<script setup lang="ts">
const props = defineProps<{
  lead?: any;
  cita?: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

const personaId = computed(() => props.lead?.id_persona || props.cita?.id_persona);

// Cargar citas de esta persona
const { data: citasData, pending } = useLazyFetch("/api/asesor/citas", {
  default: () => ({ data: [] }),
});

// Filtrar citas de esta persona
const citas = computed(() => {
  const all = citasData.value?.data || [];
  if (!personaId.value) return all;
  return all.filter((c: any) => c.id_persona === personaId.value);
});

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
</script>

<template>
  <UiBaseModal :show="true" title="Visitas Programadas" size="md" @close="emit('close')">
    <div v-if="pending" class="py-8 text-center text-gray-500">Cargando visitas...</div>

    <div v-else-if="citas.length > 0" class="space-y-4">
      <div v-for="visita in citas" :key="visita.id_cita" class="border rounded-lg p-4 bg-gray-50">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500">Fecha Agendada</p>
            <p class="font-medium">{{ formatFecha(visita.fecha_agendada) }}</p>
          </div>
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-green-100 text-green-700': visita.estado_visita_guiada === 'Realizó visita',
              'bg-yellow-100 text-yellow-700': visita.estado_visita_guiada === 'Reprogramó',
              'bg-red-100 text-red-700': visita.estado_visita_guiada === 'Canceló',
              'bg-gray-100 text-gray-700': visita.estado_visita_guiada === 'No realizó visita',
            }"
          >
            {{ visita.estado_visita_guiada }}
          </span>
        </div>

        <div v-if="visita.observacion" class="mt-2">
          <p class="text-sm text-gray-500">Observación</p>
          <p class="text-sm">{{ visita.observacion }}</p>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">No hay visitas programadas</div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')"> Cerrar </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
