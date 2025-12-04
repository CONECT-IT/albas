<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { LeadVendedor, Propiedad, Cita } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  cita?: any
  propiedadesDisponibles?: Propiedad[]
}>()

const emit = defineEmits<{
  close: []
  actualizar: [data: { id_propiedad?: number; fecha: string; hora: string }]
}>()

const visita = computed<Cita | null>(() => props.lead?.cita || props.cita || null)

const form = ref({
  id_propiedad: '',
  fecha: '',
  hora: ''
})

onMounted(() => {
  if (visita.value) {
    const fecha = new Date(visita.value.fecha_agendada)
    form.value = {
      id_propiedad: '',
      fecha: fecha.toISOString().split('T')[0],
      hora: fecha.toTimeString().slice(0, 5)
    }
  }
})

const listaPropiedades = computed(() => props.propiedadesDisponibles || [])

const propiedadOptions = computed(() =>
  listaPropiedades.value.map(p => ({
    value: p.id_propiedad,
    label: p.direccion
  }))
)

const handleSubmit = () => {
  if (!form.value.fecha) return
  emit('actualizar', {
    id_propiedad: form.value.id_propiedad ? Number(form.value.id_propiedad) : undefined,
    fecha: form.value.fecha,
    hora: form.value.hora
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Editar Visita"
    subtitle="Modifica los datos de la visita"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <UiBaseSelect
        v-model="form.id_propiedad"
        label="Propiedad"
        :options="propiedadOptions"
        placeholder="Seleccione una propiedad"
      />

      <UiBaseInput
        v-model="form.fecha"
        label="Fecha de la Visita"
        type="date"
        required
      />

      <UiBaseInput
        v-model="form.hora"
        label="Hora de la Visita"
        type="time"
      />
    </form>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="handleSubmit">
        Guardar Cambios
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
