<script setup lang="ts">
import type { LeadVendedor, Cita } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  cita?: any
}>()

const emit = defineEmits<{
  close: []
}>()

const visita = computed<Cita | null>(() => props.lead?.cita || props.cita || null)

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Información de Visita"
    size="md"
    @close="emit('close')"
  >
    <div v-if="visita" class="space-y-4">
      <div>
        <p class="text-sm text-gray-500">Fecha Agendada</p>
        <p class="font-medium">{{ formatFecha(visita.fecha_agendada) }}</p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Estado</p>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-green-100 text-green-700': visita.estado_visita_guiada === 'Realizó visita',
            'bg-yellow-100 text-yellow-700': visita.estado_visita_guiada === 'Reprogramó',
            'bg-red-100 text-red-700': visita.estado_visita_guiada === 'Canceló',
            'bg-gray-100 text-gray-700': visita.estado_visita_guiada === 'No realizó visita'
          }"
        >
          {{ visita.estado_visita_guiada }}
        </span>
      </div>

      <div v-if="visita.observacion">
        <p class="text-sm text-gray-500">Observación</p>
        <p class="font-medium">{{ visita.observacion }}</p>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">
      No hay información de visita disponible
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cerrar
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
