<script setup lang="ts">
import type { ClienteConContrato } from '~~/shared/types'

const props = defineProps<{
  cliente?: ClienteConContrato
}>()

const emit = defineEmits<{
  close: []
}>()

const conversiones = computed(() => props.cliente?.conversiones || [])

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
    title="Historial de Conversiones"
    :subtitle="cliente?.nombre"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="conversiones.length > 0" class="space-y-3">
      <div
        v-for="conversion in conversiones"
        :key="conversion.id_conversion"
        class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
      >
        <UiIconClock class="text-gray-400" />
        <div class="flex-1">
          <p class="text-sm text-gray-500">{{ formatFecha(conversion.fecha_conversion) }}</p>
          <p class="font-medium">
            <span class="text-gray-500">{{ conversion.tipo_anterior }}</span>
            <span class="mx-2">→</span>
            <span class="text-green-600">{{ conversion.tipo_nuevo }}</span>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">
      No hay historial de conversiones
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cerrar
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
