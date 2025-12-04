<script setup lang="ts">
import type { TipoPersona, EstadoVendedor, EstadoVisitaGuiada } from "~~/shared/types";

definePageMeta({
  layout: "asesor",
});

// Tab actual
type TabType = "Leads" | "Citas" | "Clientes";
const currentTab = ref<TabType>("Leads");
const setTab = (tab: TabType) => (currentTab.value = tab);

// Modal nuevo lead
const showNuevoLeadForm = ref(false);

// ============================================================
// FETCH DATA FROM API
// ============================================================

// Leads
const {
  data: leadsData,
  refresh: refreshLeads,
  pending: leadsPending,
} = useLazyFetch("/api/asesor/captacion/leads", {
  default: () => ({ data: [] }),
});
const leads = computed(() => leadsData.value?.data || []);

// Citas de Captación (vendedores)
const {
  data: citasData,
  refresh: refreshCitas,
  pending: citasPending,
} = useLazyFetch("/api/asesor/captacion/citas", {
  default: () => ({ data: [] }),
});
const citas = computed(() => citasData.value?.data || []);

// Clientes
const {
  data: clientesData,
  refresh: refreshClientes,
  pending: clientesPending,
} = useLazyFetch("/api/asesor/captacion/clientes", {
  default: () => ({ data: [] }),
});
const clientes = computed(() => clientesData.value?.data || []);

// ============================================================
// HANDLERS
// ============================================================

// Crear nuevo lead
const handleCrearLead = async (nuevoLead: {
  nombre: string;
  celular: string;
  tipo: TipoPersona;
}) => {
  try {
    await $fetch("/api/asesor/captacion/leads", {
      method: "POST",
      body: {
        nombre: nuevoLead.nombre,
        celular: nuevoLead.celular,
        tipo: nuevoLead.tipo,
      },
    });
    await refreshLeads();
    showNuevoLeadForm.value = false;
  } catch (error) {
    console.error("Error al crear lead:", error);
  }
};

// Actualizar lead (estado/observación)
const handleGuardarLead = async (lead: any) => {
  try {
    await $fetch("/api/asesor/captacion/leads", {
      method: "PUT",
      body: {
        id_persona: lead.id_persona,
        estado_vendedor: lead.estado_vendedor,
        observacion: lead.observacion,
      },
    });
    await refreshLeads();
  } catch (error) {
    console.error("Error al guardar lead:", error);
  }
};

// Eliminar lead
const handleEliminarLead = async (id: number) => {
  try {
    await $fetch("/api/asesor/captacion/leads", {
      method: "DELETE",
      body: { id_persona: id },
    });
    await refreshLeads();
  } catch (error) {
    console.error("Error al eliminar lead:", error);
  }
};

// Actualizar estado de lead
const handleUpdateEstadoLead = async (id: number, estado: EstadoVendedor) => {
  try {
    await $fetch("/api/asesor/captacion/leads", {
      method: "PUT",
      body: {
        id_persona: id,
        estado_vendedor: estado,
      },
    });
    await refreshLeads();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
};

// Guardar cita (actualizar estado)
const handleGuardarCita = async (cita: any) => {
  try {
    await $fetch("/api/asesor/citas", {
      method: "PUT",
      body: {
        id_cita: cita.id_cita,
        estado_visita_guiada: cita.estado_visita_guiada,
        observacion: cita.observacion,
      },
    });
    await refreshCitas();
  } catch (error) {
    console.error("Error al guardar cita:", error);
  }
};

// Convertir lead a cliente
const handleConvertirACliente = async (cita: any) => {
  try {
    // Registrar la conversión (esto cambia el tipo de persona a Cliente)
    await $fetch("/api/asesor/conversiones", {
      method: "POST",
      body: {
        id_persona: cita.id_persona,
      },
    });
    await refreshCitas();
    await refreshClientes();
    await refreshLeads();
  } catch (error: any) {
    console.error("Error al convertir a cliente:", error);
  }
};

// Eliminar cita
const handleEliminarCita = async (id: number) => {
  try {
    await $fetch("/api/asesor/citas", {
      method: "DELETE",
      body: { id_cita: id },
    });
    await refreshCitas();
  } catch (error) {
    console.error("Error al eliminar cita:", error);
  }
};

// Actualizar estado de cita
const handleUpdateEstadoCita = async (id: number, estado: EstadoVisitaGuiada) => {
  try {
    await $fetch("/api/asesor/citas", {
      method: "PUT",
      body: {
        id_cita: id,
        estado_visita_guiada: estado,
      },
    });
    await refreshCitas();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
};

// Eliminar cliente (de la gestión)
const handleEliminarCliente = async (id: number) => {
  try {
    await $fetch("/api/asesor/captacion/clientes", {
      method: "DELETE",
      body: { id_persona: id },
    });
    await refreshClientes();
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
};

// Actualizar vendido
const handleUpdateVendido = async (id: number, vendido: boolean) => {
  // TODO: implementar endpoint para marcar como vendido
  console.log("Update vendido:", id, vendido);
};
</script>
<!-------------------------------------------------------------PARTE VISUAL EN PANTALLA ---------------------------------------------------------------->
<template>
  <div class="p-8">
    <!-- Encabezado (Tabs + Botón agregar) -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-2">
        <button
          v-for="tab in ['Leads', 'Citas', 'Clientes'] as const"
          :key="tab"
          @click="setTab(tab)"
          class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
          :class="{
            'bg-negro-primario text-blanco-primario': currentTab === tab,
            'bg-blanco-primario text-negro-primario hover:bg-gray-50': currentTab !== tab,
          }"
        >
          {{ tab }}
        </button>
      </div>

      <button
        @click="showNuevoLeadForm = true"
        class="px-4 py-2 rounded-full font-semibold shadow-md bg-blanco-primario text-negro-primario border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        + Agregar Lead
      </button>
    </div>

    <!-- Loading states -->
    <div v-if="leadsPending && currentTab === 'Leads'" class="text-center py-8 text-gray-500">
      Cargando leads...
    </div>
    <div v-if="citasPending && currentTab === 'Citas'" class="text-center py-8 text-gray-500">
      Cargando citas...
    </div>
    <div v-if="clientesPending && currentTab === 'Clientes'" class="text-center py-8 text-gray-500">
      Cargando clientes...
    </div>

    <!-- Tabla de Leads -->
    <CaptacionTablesTablaLeads
      v-if="currentTab === 'Leads' && !leadsPending"
      :leads="leads"
      @guardar="handleGuardarLead"
      @eliminar="handleEliminarLead"
      @update-estado="handleUpdateEstadoLead"
      @refresh="
        refreshLeads();
        refreshCitas();
      "
    />

    <!-- Tabla de Citas -->
    <CaptacionTablesTablaCitas
      v-if="currentTab === 'Citas' && !citasPending"
      :citas="citas"
      @convertir="handleConvertirACliente"
      @eliminar="handleEliminarCita"
      @update-estado="handleUpdateEstadoCita"
      @refresh="refreshCitas"
    />

    <!-- Tabla de Clientes -->
    <CaptacionTablesTablaClientes
      v-if="currentTab === 'Clientes' && !clientesPending"
      :clientes="clientes"
      @eliminar="handleEliminarCliente"
      @update-vendido="handleUpdateVendido"
    />

    <!-- Modal Nuevo Lead -->
    <CaptacionFormsNuevoLeadForm
      v-if="showNuevoLeadForm"
      @close="showNuevoLeadForm = false"
      @crear="handleCrearLead"
    />
  </div>
</template>
