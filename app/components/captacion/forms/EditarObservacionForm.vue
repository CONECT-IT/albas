<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { LeadVendedor, Propiedad } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  cita?: any
  propiedadesDisponibles?: Propiedad[]
}>()

const emit = defineEmits<{
  close: []
  actualizar: [data: { propiedad: string; comentario: string }]
}>()

const observacion = computed(() => 
  props.lead?.observacion || 
  props.cita?.observacion || 
  ''
)

const propiedadSeleccionada = ref('')
const comentario = ref('')

const listaPropiedades = computed(() => 
  props.propiedadesDisponibles?.map(p => p.direccion) || []
)

onMounted(() => {
  comentario.value = observacion.value || ''
})

const handleSubmit = () => {
  emit('actualizar', {
    propiedad: propiedadSeleccionada.value,
    comentario: comentario.value
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Editar Observación"
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
      <UiBaseButton @click="handleSubmit">
        <UiIconSave size="sm" />
        Guardar Cambios
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
