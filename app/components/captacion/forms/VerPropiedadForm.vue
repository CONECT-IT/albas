<script setup lang="ts">
import type { LeadVendedor, Propiedad } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  cliente?: any
}>()

const emit = defineEmits<{
  close: []
}>()

const propiedad = computed<Propiedad | null>(() => props.lead?.propiedad || props.cliente?.propiedad || null)
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Información de Propiedad"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="propiedad" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Dirección</p>
          <p class="font-medium">{{ propiedad.direccion }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Precio</p>
          <p class="font-medium text-green-600">${{ propiedad.precio_negociable.toLocaleString() }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Medidas</p>
          <p class="font-medium">{{ propiedad.medidas || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Partida Registral</p>
          <p class="font-medium">{{ propiedad.partida_registral || '-' }}</p>
        </div>
      </div>

      <div>
        <p class="text-sm text-gray-500">Servicios Básicos</p>
        <p class="font-medium">{{ propiedad.servicios_basicos || '-' }}</p>
      </div>

      <div v-if="propiedad.descripcion">
        <p class="text-sm text-gray-500">Descripción</p>
        <p class="font-medium">{{ propiedad.descripcion }}</p>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">
      No hay información de propiedad disponible
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cerrar
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
