<script setup lang="ts">
import { ref } from 'vue'
import type { CitaExpandida, EstadoVisitaGuiada } from '~~/shared/types'
import { ESTADOS_VISITA, toSelectOptions } from '~/composables/useEstados'
import { useModal } from '~/composables/useModal'

const props = defineProps<{
  citas: CitaExpandida[]
}>()

const emit = defineEmits<{
  guardar: [cita: CitaExpandida]
  eliminar: [id: number]
  updateEstado: [id: number, estado: EstadoVisitaGuiada]
}>()

const { activeModal, selectedItem, openModal, closeModal, isOpen } = useModal<CitaExpandida>()
const confirmDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null)
const deleteDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null)

const estadoOptions = toSelectOptions(ESTADOS_VISITA)

const handleGuardar = async (cita: CitaExpandida) => {
  const confirmed = await confirmDialog.value?.open()
  if (confirmed) {
    emit('guardar', cita)
  }
}

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
  { key: 'celular', label: 'Celular', class: 'w-28' },
  { key: 'fecha', label: 'Fecha', class: 'w-24' },
  { key: 'tipo', label: 'Tipo', class: 'w-24' },
  { key: 'visita', label: 'Visitas', class: 'w-24' },
  { key: 'gastos', label: 'Gastos', class: 'w-24' },
  { key: 'observacion', label: 'Observación', class: 'w-28' },
  { key: 'estado', label: 'Estado', class: 'w-36' },
  { key: 'acciones', label: 'Acciones', class: 'w-20' },
  { key: 'guardar', label: 'Guardar', class: 'w-16' }
]
</script>

<template>
  <div class="bg-blanco-primario p-4 rounded-xl shadow-xl overflow-x-auto">
    <!-- Header -->
    <div class="flex gap-2 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200 min-w-max">
      <span v-for="col in columns" :key="col.key" :class="col.class">
        {{ col.label }}
      </span>
    </div>

    <!-- Filas -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="(cita, index) in props.citas"
        :key="cita.id_cita"
        class="flex gap-2 py-3 px-4 text-sm text-gray-800 items-center min-w-max hover:bg-gray-50 transition-colors"
      >
        <span class="w-12">{{ index + 1 }}</span>
        <span class="flex-1 min-w-[150px] font-medium">{{ cita.persona.nombre }}</span>
        <span class="w-28">{{ cita.persona.celular || '-' }}</span>
        <span class="w-24">{{ formatFecha(cita.fecha_agendada) }}</span>
        <span class="w-24">
          <span class="px-2 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-blue-100 text-blue-700': cita.persona.tipo === 'Lead Alvas',
              'bg-green-100 text-green-700': cita.persona.tipo === 'Lead Propio',
              'bg-purple-100 text-purple-700': cita.persona.tipo === 'Referido',
              'bg-amber-100 text-amber-700': cita.persona.tipo === 'Cliente'
            }"
          >
            {{ cita.persona.tipo }}
          </span>
        </span>

        <!-- Visitas -->
        <span class="w-24">
          <UiActionButtonGroup
            @add="openModal('addVisita', cita)"
            @edit="openModal('editVisita', cita)"
            @view="openModal('viewVisita', cita)"
          />
        </span>

        <!-- Gastos -->
        <span class="w-24">
          <UiActionButtonGroup
            @add="openModal('addGastos', cita)"
            @edit="openModal('editGastos', cita)"
            @view="openModal('viewGastos', cita)"
          />
        </span>

        <!-- Observación -->
        <span class="w-28">
          <UiActionButtonGroup
            @add="openModal('addObservacion', cita)"
            @edit="openModal('editObservacion', cita)"
            @view="openModal('viewObservacion', cita)"
          />
        </span>

        <!-- Estado -->
        <span class="w-36">
          <select
            :value="cita.estado_visita_guiada"
            @change="emit('updateEstado', cita.id_cita, ($event.target as HTMLSelectElement).value as EstadoVisitaGuiada)"
            class="w-full border rounded px-2 py-1 text-sm bg-white"
          >
            <option v-for="opt in estadoOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </span>

        <!-- Acciones -->
        <span class="w-20 flex gap-2">
          <button
            @click="openModal('editCita', cita)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <UiIconEdit />
          </button>
          <button
            @click="handleEliminar(cita.id_cita)"
            class="p-1 hover:bg-red-50 rounded transition-colors text-gray-600 hover:text-red-600"
            title="Eliminar"
          >
            <UiIconTrash />
          </button>
        </span>

        <!-- Guardar -->
        <span class="w-16 flex justify-center">
          <button
            @click="handleGuardar(cita)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Guardar"
          >
            <UiIconSave />
          </button>
        </span>
      </div>

      <div v-if="citas.length === 0" class="py-8 text-center text-gray-500">
        No hay citas registradas
      </div>
    </div>

    <!-- Modales -->
    <CaptacionFormsVisitaForm v-if="isOpen('addVisita')" :cita="selectedItem" @close="closeModal" />
    <CaptacionFormsEditarVisitaForm v-if="isOpen('editVisita')" :cita="selectedItem" @close="closeModal" />
    <CaptacionFormsVerVisitaForm v-if="isOpen('viewVisita')" :cita="selectedItem" @close="closeModal" />

    <CaptacionFormsGastosForm v-if="isOpen('addGastos')" :cita="selectedItem" @close="closeModal" />
    <CaptacionFormsEditarGastosForm v-if="isOpen('editGastos')" :cita="selectedItem" @close="closeModal" />
    <CaptacionFormsVerGastosForm v-if="isOpen('viewGastos')" :cita="selectedItem" @close="closeModal" />

    <CaptacionFormsObservacionForm v-if="isOpen('addObservacion')" :cita="selectedItem" @close="closeModal" />
    <CaptacionFormsEditarObservacionForm v-if="isOpen('editObservacion')" :cita="selectedItem" @close="closeModal" />
    <CaptacionFormsVerObservacionForm v-if="isOpen('viewObservacion')" :cita="selectedItem" @close="closeModal" />

    <CaptacionFormsEditarLeadForm v-if="isOpen('editCita')" :cita="selectedItem" @close="closeModal" />

    <UiConfirmDialog ref="confirmDialog" title="¿Guardar cambios?" message="¿Deseas guardar la información?" confirm-text="Sí, guardar" />
    <UiConfirmDialog ref="deleteDialog" title="¿Eliminar cita?" message="Esta acción no se puede deshacer." confirm-text="Sí, eliminar" variant="danger" />
  </div>
</template>
