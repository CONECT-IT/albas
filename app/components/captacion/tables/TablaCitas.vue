<script setup lang="ts">
import { ref } from "vue";
import type { EstadoVisitaGuiada } from "~~/shared/types";
import { ESTADOS_VISITA, toSelectOptions } from "~/composables/useEstados";
import { useModal } from "~/composables/useModal";

interface CitaAPI {
  id_cita: number;
  fecha_agendada: string;
  observacion: string | null;
  estado_visita_guiada: EstadoVisitaGuiada;
  id_persona: number;
  id_usuario: number;
  persona_nombre: string;
  persona_tipo: string;
}

const props = defineProps<{
  citas: CitaAPI[];
}>();

const emit = defineEmits<{
  convertir: [cita: CitaAPI];
  eliminar: [id: number];
  updateEstado: [id: number, estado: EstadoVisitaGuiada];
  refresh: [];
}>();

const { activeModal, selectedItem, openModal, closeModal, isOpen } = useModal<CitaAPI>();
const confirmDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null);
const deleteDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null);

const estadoOptions = toSelectOptions(ESTADOS_VISITA);

// Convertir lead a cliente
const handleConvertir = async (cita: CitaAPI) => {
  const confirmed = await confirmDialog.value?.open();
  if (confirmed) {
    emit("convertir", cita);
  }
};

const handleEliminar = async (id: number) => {
  const confirmed = await deleteDialog.value?.open();
  if (confirmed) {
    emit("eliminar", id);
  }
};

const handleModalSuccess = () => {
  closeModal();
  emit("refresh");
};

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-PE");
};

const columns = [
  { key: "id", label: "N°", class: "w-12" },
  { key: "nombre", label: "Nombre Completo", class: "flex-1 min-w-[150px]" },
  { key: "fecha", label: "Fecha Visita", class: "w-28" },
  { key: "observacion", label: "Observación", class: "w-28" },
  { key: "estado", label: "Estado", class: "w-36" },
  { key: "acciones", label: "Acciones", class: "w-20" },
];

// Verificar si una cita ya es cliente
const esCliente = (cita: CitaAPI) => cita.persona_tipo === "Cliente";
</script>

<template>
  <div class="bg-blanco-primario p-4 rounded-xl shadow-xl overflow-x-auto">
    <!-- Header -->
    <div
      class="flex gap-2 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200 min-w-max"
    >
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
        <span class="flex-1 min-w-[150px] font-medium">{{ cita.persona_nombre }}</span>
        <span class="w-28">{{ formatFecha(cita.fecha_agendada) }}</span>

        <!-- Observación de la cita -->
        <span class="w-28">
          <UiActionButtonGroup
            @add="openModal('addObservacion', cita)"
            @edit="openModal('editObservacion', cita)"
            @view="openModal('viewObservacion', cita)"
          />
        </span>

        <!-- Estado de la visita -->
        <span class="w-36">
          <select
            :value="cita.estado_visita_guiada"
            @change="
              emit(
                'updateEstado',
                cita.id_cita,
                ($event.target as HTMLSelectElement).value as EstadoVisitaGuiada,
              )
            "
            class="w-full border rounded px-2 py-1 text-sm bg-white"
          >
            <option v-for="opt in estadoOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </span>

        <!-- Acciones: Editar cita -->
        <span class="w-20 flex gap-2">
          <button
            @click="openModal('editCita', cita)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Editar cita"
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
          <!-- Convertir a cliente (solo si no es cliente) -->
          <button
            v-if="!esCliente(cita)"
            @click="handleConvertir(cita)"
            class="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
            title="Convertir a cliente"
          >
            C
          </button>
          <span
            v-else
            class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
            title="Ya es cliente"
          >
            C
          </span>
        </span>
      </div>

      <div v-if="citas.length === 0" class="py-8 text-center text-gray-500">
        No hay citas registradas
      </div>
    </div>

    <!-- Modales de observación de cita -->
    <CaptacionFormsCitaObservacionForm
      v-if="isOpen('addObservacion')"
      :cita="selectedItem"
      @close="closeModal"
      @saved="handleModalSuccess"
    />
    <CaptacionFormsCitaObservacionForm
      v-if="isOpen('editObservacion')"
      :cita="selectedItem"
      mode="edit"
      @close="closeModal"
      @saved="handleModalSuccess"
    />
    <CaptacionFormsVerCitaObservacion
      v-if="isOpen('viewObservacion')"
      :cita="selectedItem"
      @close="closeModal"
    />

    <!-- Modal editar cita -->
    <CaptacionFormsEditarCitaForm
      v-if="isOpen('editCita')"
      :cita="selectedItem"
      @close="closeModal"
      @updated="handleModalSuccess"
    />

    <UiConfirmDialog
      ref="confirmDialog"
      title="¿Convertir a cliente?"
      message="Esta acción convertirá el lead en cliente y registrará la conversión."
      confirm-text="Sí, convertir"
    />
    <UiConfirmDialog
      ref="deleteDialog"
      title="¿Eliminar cita?"
      message="Esta acción no se puede deshacer."
      confirm-text="Sí, eliminar"
      variant="danger"
    />
  </div>
</template>
