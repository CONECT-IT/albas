<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { LeadVendedor, Propiedad } from '~~/shared/types'

const props = defineProps<{
  lead?: LeadVendedor
  propiedad?: Propiedad
}>()

const emit = defineEmits<{
  close: []
  crear: [data: Partial<Propiedad> & { leadId?: number }]
  actualizar: [data: Partial<Propiedad> & { leadId?: number }]
}>()

const esEdicion = computed(() => !!props.propiedad)

interface Caracteristica {
  id: number
  nombre: string
  valor: string
}

const form = ref({
  direccion: '',
  precio_negociable: 0,
  medidas: '',
  servicios_basicos: '',
  partida_registral: '',
  descripcion: ''
})

const carNombre = ref('')
const carValor = ref('')
const caracteristicas = ref<Caracteristica[]>([])
const idCaracteristicaEditando = ref<number | null>(null)

onMounted(() => {
  if (props.propiedad) {
    form.value = {
      direccion: props.propiedad.direccion,
      precio_negociable: props.propiedad.precio_negociable,
      medidas: props.propiedad.medidas || '',
      servicios_basicos: props.propiedad.servicios_basicos || '',
      partida_registral: props.propiedad.partida_registral || '',
      descripcion: props.propiedad.descripcion || ''
    }
  }
})

const guardarCaracteristica = () => {
  if (!carNombre.value.trim() || !carValor.value.trim()) return

  if (idCaracteristicaEditando.value !== null) {
    const index = caracteristicas.value.findIndex(c => c.id === idCaracteristicaEditando.value)
    if (index !== -1) {
      caracteristicas.value[index].nombre = carNombre.value
      caracteristicas.value[index].valor = carValor.value
    }
    idCaracteristicaEditando.value = null
  } else {
    caracteristicas.value.push({
      id: Date.now(),
      nombre: carNombre.value,
      valor: carValor.value
    })
  }
  carNombre.value = ''
  carValor.value = ''
}

const editarCaracteristica = (item: Caracteristica) => {
  carNombre.value = item.nombre
  carValor.value = item.valor
  idCaracteristicaEditando.value = item.id
}

const eliminarCaracteristica = (id: number) => {
  caracteristicas.value = caracteristicas.value.filter(c => c.id !== id)
  if (idCaracteristicaEditando.value === id) {
    idCaracteristicaEditando.value = null
    carNombre.value = ''
    carValor.value = ''
  }
}

const handleSubmit = () => {
  if (!form.value.direccion || !form.value.precio_negociable) {
    alert('Por favor ingrese al menos la Dirección y el Precio.')
    return
  }

  const datos = {
    ...form.value,
    detalles: caracteristicas.value,
    leadId: props.lead?.id_persona
  }

  if (esEdicion.value) {
    emit('actualizar', datos)
  } else {
    emit('crear', datos)
  }
  emit('close')
}
</script>

<template>
  <UiBaseModal
    :show="true"
    :title="esEdicion ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'"
    :subtitle="esEdicion ? 'Modifica los datos de la propiedad.' : 'Completa la información de la nueva propiedad.'"
    size="xl"
    @close="emit('close')"
  >
    <div class="space-y-4">
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

      <!-- Características -->
      <div class="mt-6">
        <h3 class="text-lg font-bold text-black mb-4">Características Adicionales</h3>
        
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
          <p class="text-xs font-bold mb-3 text-gray-600">
            {{ idCaracteristicaEditando !== null ? 'Editando Característica...' : 'Agregar Característica' }}
          </p>
          <div class="grid grid-cols-2 gap-4 mb-2">
            <UiBaseInput
              v-model="carNombre"
              label="Nombre"
              placeholder="Ej: Tipo"
              @keyup.enter="guardarCaracteristica"
            />
            <UiBaseInput
              v-model="carValor"
              label="Valor"
              placeholder="Ej: Departamento"
              @keyup.enter="guardarCaracteristica"
            />
          </div>
          <div class="flex justify-end">
            <button
              @click="guardarCaracteristica"
              class="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <UiIconPlus v-if="idCaracteristicaEditando === null" size="sm" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Lista de características -->
        <div v-if="caracteristicas.length > 0" class="rounded-lg overflow-hidden border border-gray-200">
          <div class="grid grid-cols-[1fr_2fr_80px] px-4 py-3 text-xs font-bold text-gray-600 bg-gray-50 border-b">
            <span>Nombre</span>
            <span>Valor</span>
            <span class="text-right">Acciones</span>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in caracteristicas"
              :key="item.id"
              class="grid grid-cols-[1fr_2fr_80px] items-center px-4 py-3"
              :class="{ 'bg-gray-100': item.id === idCaracteristicaEditando }"
            >
              <span class="text-sm font-semibold">{{ item.nombre }}</span>
              <span class="text-sm text-gray-600">{{ item.valor }}</span>
              <div class="flex justify-end gap-2">
                <button @click="editarCaracteristica(item)" class="text-gray-400 hover:text-black">
                  <UiIconEdit size="sm" />
                </button>
                <button @click="eliminarCaracteristica(item.id)" class="text-gray-400 hover:text-red-500">
                  <UiIconTrash size="sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="handleSubmit">
        {{ esEdicion ? 'Guardar Cambios' : 'Crear Propiedad' }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
