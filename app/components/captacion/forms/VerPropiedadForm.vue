<script setup lang="ts">
const props = defineProps<{
  lead?: any;
  cliente?: any;
}>();

const emit = defineEmits<{
  close: [];
}>();

const personaId = computed(() => props.lead?.id_persona || props.cliente?.id_persona);

const { data: propiedadesData, pending } = useLazyFetch("/api/asesor/captacion/propiedades", {
  query: { id_persona: personaId },
  default: () => ({ data: [] }),
  watch: [personaId],
});

const propiedades = computed(() => propiedadesData.value?.data || []);
</script>

<template>
  <UiBaseModal :show="true" title="Propiedades del Vendedor" size="lg" @close="emit('close')">
    <div v-if="pending" class="py-8 text-center text-gray-500">Cargando propiedades...</div>

    <div v-else-if="propiedades.length > 0" class="space-y-4">
      <div
        v-for="propiedad in propiedades"
        :key="propiedad.id_propiedad"
        class="border rounded-lg p-4 bg-gray-50"
      >
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Dirección</p>
            <p class="font-medium">{{ propiedad.direccion }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Precio</p>
            <p class="font-medium text-green-600">
              ${{ propiedad.precio_negociable?.toLocaleString() }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p class="text-sm text-gray-500">Medidas</p>
            <p class="font-medium">{{ propiedad.medidas || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Partida Registral</p>
            <p class="font-medium">{{ propiedad.partida_registral || "-" }}</p>
          </div>
        </div>

        <div class="mt-3">
          <p class="text-sm text-gray-500">Servicios Básicos</p>
          <p class="font-medium">{{ propiedad.servicios_basicos || "-" }}</p>
        </div>

        <div v-if="propiedad.descripcion" class="mt-3">
          <p class="text-sm text-gray-500">Descripción</p>
          <p class="font-medium">{{ propiedad.descripcion }}</p>
        </div>

        <div v-if="propiedad.observacion" class="mt-3">
          <p class="text-sm text-gray-500">Observación</p>
          <p class="font-medium text-blue-600">{{ propiedad.observacion }}</p>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-gray-500">No hay propiedades asignadas</div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')"> Cerrar </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
