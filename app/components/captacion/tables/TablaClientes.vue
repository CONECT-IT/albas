<script setup lang="ts">
import { ref } from 'vue'
import type { ClienteConContrato } from '~~/shared/types'
import { useModal } from '~/composables/useModal'

const props = defineProps<{
  clientes: ClienteConContrato[]
}>()

const emit = defineEmits<{
  eliminar: [id: number]
  updateVendido: [id: number, vendido: boolean]
}>()

const { activeModal, selectedItem, openModal, closeModal, isOpen } = useModal<ClienteConContrato>()
const deleteDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null)

const searchQuery = ref('')

const filteredClientes = computed(() => {
  if (!searchQuery.value) return props.clientes
  const query = searchQuery.value.toLowerCase()
  return props.clientes.filter(c => 
    c.nombre.toLowerCase().includes(query) ||
    c.celular?.toLowerCase().includes(query)
  )
})

const handleEliminar = async (id: number) => {
  const confirmed = await deleteDialog.value?.open()
  if (confirmed) {
    emit('eliminar', id)
  }
}

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-PE')
}

const columns = [
  { key: 'id', label: 'N°', class: 'w-12' },
  { key: 'nombre', label: 'Nombre Completo', class: 'flex-1 min-w-[150px]' },
  { key: 'celular', label: 'Contacto', class: 'w-28' },
  { key: 'fecha', label: 'Fecha', class: 'w-24' },
  { key: 'tipo', label: 'Tipo', class: 'w-24' },
  { key: 'historial', label: 'Historial', class: 'w-20' },
  { key: 'propiedades', label: 'Propiedades', class: 'w-24' },
  { key: 'contrato', label: 'Contrato', class: 'w-20' },
  { key: 'vendido', label: 'Vendido', class: 'w-28' },
  { key: 'observacion', label: 'Observaciones', class: 'w-28' },
  { key: 'acciones', label: 'Acciones', class: 'w-20' }
]

const vendidoOptions = [
  { value: '', label: 'Seleccionar' },
  { value: 'false', label: 'No' },
  { value: 'true', label: 'Sí' }
]
</script>

<template>
  <div class="bg-blanco-primario p-4 rounded-xl shadow-xl overflow-x-auto">
    <!-- Buscador -->
    <div class="mb-4">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, celular..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
        />
      </div>
    </div>

    <!-- Header -->
    <div class="flex gap-2 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200 min-w-max">
      <span v-for="col in columns" :key="col.key" :class="col.class">
        {{ col.label }}
      </span>
    </div>

    <!-- Filas -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="(cliente, index) in filteredClientes"
        :key="cliente.id_persona"
        class="flex gap-2 py-3 px-4 text-sm text-gray-800 items-center min-w-max hover:bg-gray-50 transition-colors"
      >
        <span class="w-12">{{ index + 1 }}</span>
        <span class="flex-1 min-w-[150px] font-medium">{{ cliente.nombre }}</span>
        <span class="w-28">{{ cliente.celular || '-' }}</span>
        <span class="w-24">{{ formatFecha(cliente.fecha_captacion) }}</span>
        <span class="w-24">
          <span class="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            {{ cliente.tipo }}
          </span>
        </span>

        <!-- Historial -->
        <span class="w-20 flex justify-center">
          <button
            @click="openModal('viewHistorial', cliente)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Ver Historial"
          >
            <UiIconClock />
          </button>
        </span>

        <!-- Propiedades -->
        <span class="w-24 flex justify-center">
          <button
            @click="openModal('viewPropiedad', cliente)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Ver Propiedades"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>
        </span>

        <!-- Contrato -->
        <span class="w-20 flex justify-center">
          <button
            @click="openModal('subirContrato', cliente)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Subir Contrato"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          </button>
        </span>

        <!-- Vendido -->
        <span class="w-28">
          <select
            :value="cliente.contrato ? 'true' : ''"
            @change="emit('updateVendido', cliente.id_persona, ($event.target as HTMLSelectElement).value === 'true')"
            class="w-full border rounded px-2 py-1 text-sm bg-white"
          >
            <option v-for="opt in vendidoOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </span>

        <!-- Observaciones -->
        <span class="w-28 flex justify-center">
          <button
            @click="openModal('viewObservacion', cliente)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Ver Observaciones"
          >
            <UiIconEye />
          </button>
        </span>

        <!-- Acciones -->
        <span class="w-20 flex gap-2">
          <button
            @click="openModal('editCliente', cliente)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <UiIconEdit />
          </button>
          <button
            @click="handleEliminar(cliente.id_persona)"
            class="p-1 hover:bg-red-50 rounded transition-colors text-gray-600 hover:text-red-600"
            title="Eliminar"
          >
            <UiIconTrash />
          </button>
        </span>
      </div>

      <div v-if="filteredClientes.length === 0" class="py-8 text-center text-gray-500">
        {{ searchQuery ? 'No se encontraron resultados' : 'No hay clientes registrados' }}
      </div>
    </div>

    <!-- Modales -->
    <CaptacionFormsVerHistorialForm v-if="isOpen('viewHistorial')" :cliente="selectedItem" @close="closeModal" />
    <CaptacionFormsVerPropiedadForm v-if="isOpen('viewPropiedad')" :cliente="selectedItem" @close="closeModal" />
    <CaptacionFormsSubirContratoForm v-if="isOpen('subirContrato')" :cliente="selectedItem" @close="closeModal" />
    <CaptacionFormsVerObservacionForm v-if="isOpen('viewObservacion')" :cliente="selectedItem" @close="closeModal" />
    <CaptacionFormsEditarLeadForm v-if="isOpen('editCliente')" :cliente="selectedItem" @close="closeModal" />

    <UiConfirmDialog ref="deleteDialog" title="¿Eliminar cliente?" message="Esta acción no se puede deshacer." confirm-text="Sí, eliminar" variant="danger" />
  </div>
</template>
