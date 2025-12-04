<script setup lang="ts">
import { ref } from "vue";
// Uso de diseño asesor
definePageMeta({
  layout: "asesor",
});

// Tabs actual,(Leads, Citas, Clientes)
const currentTab = ref("Leads");
const setTab = (tab: string) => (currentTab.value = tab);

//Modal agregar Nuevo Lead
const showNuevoLeadForm = ref(false);

const nuevoLeadForm = (nuevoLead: any) => {
  leads.value.push({
    id: leads.value.length + 1,
    nombre: nuevoLead.nombre,
    celular: nuevoLead.celular,
    fecha: nuevoLead.fecha,
    tipo: nuevoLead.tipo,
    estado: "seguimiento",
  });
};

//---------------------------------------------------DATOS GENERADOS(Adaptar)--------------------------------------------------------------------
// Lead único en Leads
const leads = ref([
  {
    id: 1,
    nombre: "Lead Ejemplo",
    celular: "900000000",
    fecha: "01/01/2025",
    tipo: "Propio",
    estado: "Seguimiento",
  },
]);

// Vacío: esperará al Guardar
const citas = ref([]);

// Vacío: esperará al Guardar
const clientes = ref([]);

// PASAR DE LEADS → CITAS
const pasarLeadACitas = (lead: any) => {
  citas.value.push({
    id: citas.value.length + 1,
    nombre: lead.nombre,
    celular: lead.celular,
    fecha: lead.fecha,
    tipo: lead.tipo,
    Estado: "realizado",
  });

  // Remover de leads
  leads.value = leads.value.filter((l) => l.id !== lead.id);
};

// PASAR DE CITAS → CLIENTES
const pasarCitaAClientes = (cita: any) => {
  clientes.value.push({
    id: clientes.value.length + 1,
    nombre: cita.nombre,
    celular: cita.celular,
    fecha: cita.fecha,
    tipo: cita.tipo,
    Vendido: "seleccionar",
  });

  // Remover de citas
  citas.value = citas.value.filter((c) => c.id !== cita.id);
};

const store = {
  leads,
  citas,
  clientes,
};

const eliminarItem = (tipo: "leads" | "citas" | "clientes", id: number) => {
  store[tipo].value = store[tipo].value.filter((item) => item.id !== id);
};
//---------------------------------------------------FINAL DE DATOS GENERADOS --------------------------------------------------------------------

// ---------------Estados posibles Leads, citas, clientes----------------------------
const estados = ["Seguimiento", "Cierre", "No responde"];
const estadosCitas = ["realizado", "reprogramo", "cancelo"];
const VendidoClientes = ["seleccionar", "No", "Si"];
</script>
<!-------------------------------------------------------------PARTE VISUAL EN PANTALLA ---------------------------------------------------------------->
<template>
  <div class="p-8">
    <!-- Encabezado (Leads, Citas,  Clientes)-->
    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-2">
        <!-- TAB: Leads -->
        <button
          @click="setTab('Leads')"
          class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
          :class="{
            'bg-negro-primario text-blanco-primario': currentTab === 'Leads',
            'bg-blanco-primario text-negro-primario': currentTab !== 'Leads',
          }"
        >
          Leads
        </button>

        <!-- TAB: Citas -->
        <button
          @click="setTab('Citas')"
          class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
          :class="{
            'bg-negro-primario text-blanco-primario': currentTab === 'Citas',
            'bg-blanco-primario text-negro-primario': currentTab !== 'Citas',
          }"
        >
          Citas
        </button>

        <!-- TAB: Clientes -->
        <button
          @click="setTab('Clientes')"
          class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
          :class="{
            'bg-negro-primario text-blanco-primario': currentTab === 'Clientes',
            'bg-blanco-primario text-negro-primario': currentTab !== 'Clientes',
          }"
        >
          Clientes
        </button>
      </div>

      <!-- ------------------------Botón agregar Lead------------------------------- -->
      <button
        @click="showNuevoLeadForm = true"
        class="px-4 py-2 rounded-full font-semibold shadow-md bg-blanco-primario text-negro-primario border border-gray-200"
      >
        + Agregar Lead
      </button>
    </div>

    <!------------------------------------------------------TABLA DE LEADS----------------------------------------------------------------------->
    <div v-if="currentTab === 'Leads'">
      <TablaLeads
        :leads="leads"
        :estados="estados"
        @guardar="pasarLeadACitas"
        @eliminar="(id) => eliminarItem('leads', id)"
      />
    </div>
    <!------------------------------------------------------TABLA DE CITAS----------------------------------------------------------------------->
    <div v-else-if="currentTab === 'Citas'">
      <TablaCitas
        :citas="citas"
        :estadosCitas="estadosCitas"
        @guardar="pasarCitaAClientes"
        @eliminar="(id) => eliminarItem('citas', id)"
      />
    </div>
    <!------------------------------------------------------TABLA DE CLIENTES----------------------------------------------------------------------->
    <div v-else-if="currentTab === 'Clientes'">
      <TablaClientes
        :clientes="clientes"
        :VendidoClientes="VendidoClientes"
        @eliminar="(id) => eliminarItem('clientes', id)"
      />
    </div>

    <!-- Modal Agregar Nuevo Lead -->
    <NuevoLeadForm
      v-if="showNuevoLeadForm"
      @close="showNuevoLeadForm = false"
      @crear="nuevoLeadForm"
    />
  </div>
</template>
