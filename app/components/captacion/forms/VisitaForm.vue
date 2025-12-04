<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LeadVendedor, Propiedad } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  propiedadesDisponibles?: Propiedad[]
}>()

const emit = defineEmits<{
  close: []
  crear: [data: { leadId?: number; id_propiedad: number; fecha: string; hora: string }]
}>()

const form = ref({
  id_propiedad: '',
  fecha: '',
  hora: ''
})

const listaPropiedades = computed(() => props.propiedadesDisponibles || [])

const propiedadOptions = computed(() =>
  listaPropiedades.value.map(p => ({
    value: p.id_propiedad,
    label: p.direccion
  }))
)

const handleSubmit = () => {
  if (!form.value.id_propiedad || !form.value.fecha) {
    return
  }
  emit('crear', {
    leadId: props.lead?.id_persona,
    id_propiedad: Number(form.value.id_propiedad),
    fecha: form.value.fecha,
    hora: form.value.hora
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Programar Visita"
    subtitle="Seleccione una propiedad y fecha para la visita"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <UiBaseSelect
        v-model="form.id_propiedad"
        label="Propiedad"
        :options="propiedadOptions"
        placeholder="Seleccione una propiedad"
        required
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
        Programar Visita
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
