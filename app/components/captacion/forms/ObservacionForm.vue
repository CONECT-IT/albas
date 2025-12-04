<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LeadVendedor, Propiedad } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  cita?: any
  propiedadesDisponibles?: Propiedad[]
}>()

const emit = defineEmits<{
  close: []
  guardar: [data: { propiedad: string; comentario: string }]
}>()

const propiedadSeleccionada = ref('')
const comentario = ref('')

const listaPropiedades = computed(() => 
  props.propiedadesDisponibles?.map(p => p.direccion) || []
)

const guardarObservacion = () => {
  emit('guardar', {
    propiedad: propiedadSeleccionada.value,
    comentario: comentario.value
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Observaciones"
    subtitle="Seleccione una propiedad y agregue su observación"
    size="lg"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Propiedad</label>
        <select
          v-model="propiedadSeleccionada"
          class="w-full bg-gray-100 px-4 py-2 rounded-lg outline-none cursor-pointer"
        >
          <option disabled value="">Seleccione una propiedad</option>
          <option v-for="(prop, index) in listaPropiedades" :key="index">
            {{ prop }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Comentario</label>
        <textarea
          v-model="comentario"
          placeholder="Escriba su observación..."
          class="w-full h-40 border border-gray-300 px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-black"
        />
      </div>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="guardarObservacion">
        <UiIconSave size="sm" />
        Guardar
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
