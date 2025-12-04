<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { LeadVendedor, TipoPersona } from '~~/shared/types'
import { TIPOS_PERSONA, toSelectOptions } from '~/composables/useEstados'

const props = defineProps<{
  lead?: LeadVendedor
  cita?: any
  cliente?: any
}>()

const emit = defineEmits<{
  close: []
  actualizar: [data: Partial<LeadVendedor>]
}>()

const item = computed(() => props.lead || props.cita?.persona || props.cliente)

const form = ref({
  nombre: '',
  celular: '',
  tipo: '' as TipoPersona | ''
})

const tipoOptions = toSelectOptions(TIPOS_PERSONA)

onMounted(() => {
  if (item.value) {
    form.value = {
      nombre: item.value.nombre || '',
      celular: item.value.celular || '',
      tipo: item.value.tipo || ''
    }
  }
})

const handleSubmit = () => {
  if (!form.value.nombre) return
  emit('actualizar', {
    id_persona: item.value?.id_persona,
    nombre: form.value.nombre,
    celular: form.value.celular,
    tipo: form.value.tipo as TipoPersona
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Editar Lead"
    subtitle="Modifica la información del lead"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UiBaseInput
        v-model="form.nombre"
        label="Nombre Completo"
        placeholder="Ingrese nombre"
        required
      />

      <UiBaseInput
        v-model="form.celular"
        label="Número de Celular"
        placeholder="900000000"
        type="tel"
      />

      <UiBaseSelect
        v-model="form.tipo"
        label="Tipo"
        :options="tipoOptions"
        placeholder="Seleccione tipo"
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
