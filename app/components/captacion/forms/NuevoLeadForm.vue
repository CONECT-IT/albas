<script setup lang="ts">
import { ref } from 'vue'
import type { TipoPersona } from '~~/shared/types'
import { TIPOS_PERSONA, toSelectOptions } from '~/composables/useEstados'

const emit = defineEmits<{
  close: []
  crear: [data: { nombre: string; celular: string; fecha: string; tipo: TipoPersona }]
}>()

const form = ref({
  nombre: '',
  celular: '',
  fecha: '',
  tipo: '' as TipoPersona | ''
})

const tipoOptions = toSelectOptions(TIPOS_PERSONA.filter(t => t !== 'Cliente'))

const handleSubmit = () => {
  if (!form.value.nombre || !form.value.tipo) {
    return
  }
  emit('crear', {
    nombre: form.value.nombre,
    celular: form.value.celular,
    fecha: form.value.fecha || new Date().toISOString().split('T')[0],
    tipo: form.value.tipo as TipoPersona
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Nuevo Lead"
    subtitle="Ingrese la información del Lead"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          v-model="form.nombre"
          label="Nombre Completo"
          placeholder="Ingrese nombre"
          required
        />
        <UiBaseInput
          v-model="form.fecha"
          label="Fecha"
          type="date"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
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
          required
        />
      </div>
    </form>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="handleSubmit">
        Crear Lead
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
