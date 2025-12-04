<script setup lang="ts">
import { ref } from 'vue'
import type { ClienteConContrato } from '~~/shared/types'

const props = defineProps<{
  cliente?: ClienteConContrato
}>()

const emit = defineEmits<{
  close: []
  subir: [data: { archivo: File; clienteId: number }]
}>()

const archivo = ref<File | null>(null)
const isDragging = ref(false)

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    archivo.value = files[0]
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    archivo.value = target.files[0]
  }
}

const handleSubmit = () => {
  if (!archivo.value || !props.cliente) return
  emit('subir', {
    archivo: archivo.value,
    clienteId: props.cliente.id_persona
  })
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Subir Contrato"
    :subtitle="cliente?.nombre"
    size="md"
    @close="emit('close')"
  >
    <div
      class="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
      :class="{
        'border-gray-300 bg-gray-50': !isDragging,
        'border-black bg-gray-100': isDragging
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="!archivo">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto text-gray-400 mb-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
        <p class="text-gray-600 mb-2">Arrastra el archivo aquí o</p>
        <label class="cursor-pointer text-black font-semibold hover:underline">
          selecciona un archivo
          <input type="file" class="hidden" accept=".pdf,.doc,.docx" @change="handleFileSelect" />
        </label>
        <p class="text-xs text-gray-400 mt-2">PDF, DOC o DOCX hasta 10MB</p>
      </div>

      <div v-else class="flex items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-green-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <div class="text-left">
          <p class="font-medium">{{ archivo.name }}</p>
          <p class="text-xs text-gray-500">{{ (archivo.size / 1024).toFixed(1) }} KB</p>
        </div>
        <button @click="archivo = null" class="ml-2 text-gray-400 hover:text-red-500">
          <UiIconTrash size="sm" />
        </button>
      </div>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cancelar
      </UiBaseButton>
      <UiBaseButton :disabled="!archivo" @click="handleSubmit">
        Subir Contrato
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
