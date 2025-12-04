<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Propiedad } from '~~/shared/types'

const props = defineProps<{
  lead?: any
  propiedad?: Propiedad
}>()

const emit = defineEmits<{
  close: []
  actualizar: [data: Partial<Propiedad>]
}>()

const form = ref({
  direccion: '',
  precio_negociable: 0,
  medidas: '',
  servicios_basicos: '',
  partida_registral: '',
  descripcion: ''
})

onMounted(() => {
  const prop = props.propiedad || props.lead?.propiedad
  if (prop) {
    form.value = {
      direccion: prop.direccion || '',
      precio_negociable: prop.precio_negociable || 0,
      medidas: prop.medidas || '',
      servicios_basicos: prop.servicios_basicos || '',
      partida_registral: prop.partida_registral || '',
      descripcion: prop.descripcion || ''
    }
  }
})

const handleSubmit = () => {
  if (!form.value.direccion || !form.value.precio_negociable) {
    return
  }
  emit('actualizar', form.value)
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Editar Propiedad"
    subtitle="Modifica los datos de la propiedad"
    size="lg"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UiBaseInput
        v-model="form.direccion"
        label="Dirección"
        placeholder="Ej: Av. Perú 123"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          v-model="form.precio_negociable"
          label="Precio ($)"
          type="number"
          placeholder="30000"
          required
        />
        <UiBaseInput
          v-model="form.medidas"
          label="Medidas"
          placeholder="Ej: 200 m2"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          v-model="form.servicios_basicos"
          label="Servicios Básicos"
          placeholder="Ej: Agua, luz"
        />
        <UiBaseInput
          v-model="form.partida_registral"
          label="Partida Registral"
          placeholder="Ej: PR-001"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Descripción</label>
        <textarea
          v-model="form.descripcion"
          placeholder="Descripción de la propiedad..."
          class="w-full border border-gray-300 rounded-lg p-2.5 resize-none h-20"
        />
      </div>
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
