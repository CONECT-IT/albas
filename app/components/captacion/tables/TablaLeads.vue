<script setup lang="ts">
import { ref } from "vue";
import type { EstadoVendedor } from "~~/shared/types";
import { ESTADOS_VENDEDOR, toSelectOptions } from "~/composables/useEstados";
import { useModal } from "~/composables/useModal";

const props = defineProps<{
  leads: any[];
}>();

const emit = defineEmits<{
  guardar: [lead: any];
  eliminar: [id: number];
  updateEstado: [id: number, estado: EstadoVendedor];
  refresh: [];
}>();

const { activeModal, selectedItem, openModal, closeModal, isOpen } = useModal<any>();
const confirmDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null);
const deleteDialog = ref<InstanceType<typeof UiConfirmDialog> | null>(null);

const estadoOptions = toSelectOptions(ESTADOS_VENDEDOR);

const handleGuardar = async (lead: any) => {
  const confirmed = await confirmDialog.value?.open();
  if (confirmed) {
    emit("guardar", lead);
  }
};

const handleEliminar = async (id: number) => {
  const confirmed = await deleteDialog.value?.open();
  if (confirmed) {
    emit("eliminar", id);
  }
};

const handleEstadoChange = (lead: any, estado: EstadoVendedor) => {
  emit("updateEstado", lead.id_persona, estado);
};

const handleModalSuccess = () => {
  closeModal();
  emit("refresh");
};

// Columnas de la tabla
const formatFecha = (fecha: string) => {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-PE");
};

const columns = [
  { key: "id", label: "N°", class: "w-12" },
  { key: "nombre", label: "Nombre Completo", class: "flex-1 min-w-[150px]" },
  { key: "celular", label: "Celular", class: "w-28" },
  { key: "fecha", label: "Fecha", class: "w-24" },
  { key: "tipo", label: "Tipo", class: "w-24" },
  { key: "propiedad", label: "Propiedad", class: "w-24" },
  { key: "visita", label: "Visita", class: "w-24" },
  { key: "observacion", label: "Observación", class: "w-28" },
  { key: "estado", label: "Estado", class: "w-32" },
  { key: "acciones", label: "Acciones", class: "w-20" },
  { key: "guardar", label: "Guardar", class: "w-16" },
];
</script>

<template>
  <div class="bg-blanco-primario p-4 rounded-xl shadow-xl overflow-x-auto">
    <!-- Header de la tabla -->
    <div
      class="flex gap-2 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200 min-w-max"
    >
      <span v-for="col in columns" :key="col.key" :class="col.class">
        {{ col.label }}
      </span>
    </div>

    <!-- Filas de la tabla -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="(lead, index) in props.leads"
        :key="lead.id_persona"
        class="flex gap-2 py-3 px-4 text-sm text-gray-800 items-center min-w-max hover:bg-gray-50 transition-colors"
      >
        <!-- N° -->
        <span class="w-12">{{ index + 1 }}</span>

        <!-- Nombre -->
        <span class="flex-1 min-w-[150px] font-medium">{{ lead.nombre }}</span>

        <!-- Celular -->
        <span class="w-28">{{ lead.celular || "-" }}</span>

        <!-- Fecha -->
        <span class="w-24">{{ formatFecha(lead.fecha_captacion) }}</span>

        <!-- Tipo -->
        <span class="w-24">
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-blue-100 text-blue-700': lead.tipo === 'Lead Alvas',
              'bg-green-100 text-green-700': lead.tipo === 'Lead Propio',
              'bg-purple-100 text-purple-700': lead.tipo === 'Referido',
              'bg-amber-100 text-amber-700': lead.tipo === 'Cliente',
            }"
          >
            {{ lead.tipo }}
          </span>
        </span>

        <!-- Propiedad -->
        <span class="w-24">
          <UiActionButtonGroup
            @add="openModal('addPropiedad', lead)"
            @edit="openModal('editPropiedad', lead)"
            @view="openModal('viewPropiedad', lead)"
          />
        </span>

        <!-- Visita -->
        <span class="w-24">
          <UiActionButtonGroup
            @add="openModal('addVisita', lead)"
            @edit="openModal('editVisita', lead)"
            @view="openModal('viewVisita', lead)"
          />
        </span>

        <!-- Observación -->
        <span class="w-28">
          <UiActionButtonGroup
            @add="openModal('addObservacion', lead)"
            @edit="openModal('editObservacion', lead)"
            @view="openModal('viewObservacion', lead)"
          />
        </span>

        <!-- Estado -->
        <span class="w-32">
          <select
            :value="lead.estado_vendedor"
            @change="
              handleEstadoChange(lead, ($event.target as HTMLSelectElement).value as EstadoVendedor)
            "
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
            @click="openModal('editLead', lead)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Editar Lead"
          >
            <UiIconEdit />
          </button>
          <button
            @click="handleEliminar(lead.id_persona)"
            class="p-1 hover:bg-red-50 rounded transition-colors text-gray-600 hover:text-red-600"
            title="Eliminar Lead"
          >
            <UiIconTrash />
          </button>
        </span>

        <!-- Guardar -->
        <span class="w-16 flex justify-center">
          <button
            @click="handleGuardar(lead)"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Guardar"
          >
            <UiIconSave />
          </button>
        </span>
      </div>

      <!-- Empty state -->
      <div v-if="leads.length === 0" class="py-8 text-center text-gray-500">
        No hay leads registrados
      </div>
    </div>

    <!-- Modales de Propiedad -->
    <CaptacionFormsPropiedadForm
      v-if="isOpen('addPropiedad')"
      :lead="selectedItem"
      @close="closeModal"
      @created="handleModalSuccess"
    />
    <CaptacionFormsEditarPropiedadForm
      v-if="isOpen('editPropiedad')"
      :lead="selectedItem"
      @close="closeModal"
      @updated="handleModalSuccess"
    />
    <CaptacionFormsVerPropiedadForm
      v-if="isOpen('viewPropiedad')"
      :lead="selectedItem"
      @close="closeModal"
    />

    <!-- Modales de Visita -->
    <CaptacionFormsVisitaForm
      v-if="isOpen('addVisita')"
      :lead="selectedItem"
      @close="closeModal"
      @created="handleModalSuccess"
    />
    <CaptacionFormsEditarVisitaForm
      v-if="isOpen('editVisita')"
      :lead="selectedItem"
      @close="closeModal"
      @updated="handleModalSuccess"
    />
    <CaptacionFormsVerVisitaForm
      v-if="isOpen('viewVisita')"
      :lead="selectedItem"
      @close="closeModal"
    />

    <!-- Modales de Observación -->
    <CaptacionFormsObservacionForm
      v-if="isOpen('addObservacion')"
      :lead="selectedItem"
      @close="closeModal"
      @saved="handleModalSuccess"
    />
    <CaptacionFormsEditarObservacionForm
      v-if="isOpen('editObservacion')"
      :lead="selectedItem"
      @close="closeModal"
      @updated="handleModalSuccess"
    />
    <CaptacionFormsVerObservacionForm
      v-if="isOpen('viewObservacion')"
      :lead="selectedItem"
      @close="closeModal"
    />

    <!-- Modal Editar Lead -->
    <CaptacionFormsEditarLeadForm
      v-if="isOpen('editLead')"
      :lead="selectedItem"
      @close="closeModal"
      @updated="handleModalSuccess"
    />

    <!-- Dialogs de confirmación -->
    <UiConfirmDialog
      ref="confirmDialog"
      title="¿Guardar cambios?"
      message="¿Deseas guardar la información de este lead?"
      confirm-text="Sí, guardar"
    />
    <UiConfirmDialog
      ref="deleteDialog"
      title="¿Eliminar lead?"
      message="Esta acción no se puede deshacer."
      confirm-text="Sí, eliminar"
      variant="danger"
    />
  </div>
</template>
