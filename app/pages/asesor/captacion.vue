<script setup lang="ts">
import { ref } from "vue";

/*---------------------------------------importaciones--------------------------------*/

import NuevoLeadForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue"; //Formulario para agregar Nuevo Lead de Captacion
import TablaLeads from "~/components/asesor/asesor/Tables/Captacion/tablaLeads.vue"; //Componente reutilizable para tabla de leads
import TablaCitas from "~/components/asesor/asesor/Tables/Captacion/tablaCitas.vue"; //Componente reutilizable para tabla de Citas
import TablaClientes from "~/components/asesor/asesor/Tables/Captacion/tablaClientes.vue"; //Componente reutilizable para tabla de Clientes

// Uso de diseño asesor
definePageMeta({
  layout: "asesor",
});

// Tabs actual,(Leads, Citas, Clientes)
const currentTab = ref("Leads");
const setTab = (tab: string) => (currentTab.value = tab);

//Modal agregar Nuevo Lead
const showNuevoLeadForm = ref(false);

//---------------------------------------------------DATOS GENERADOS(Adaptar)--------------------------------------------------------------------
// Datos Generados leads
const leads = ref([
  {
    id: 1,
    nombre: "Jose Mamani Lopez",
    celular: "945234123",
    fecha: "23 / 23 / 23",
    tipo: "Propios",
    estado: "Seguimiento",
  },
]);

//Datos Generados Citas
const citas = ref([
  {
    id: 1,
    nombre: "Jose Gonzales Lopez",
    celular: "999999999",
    fecha: "23 /24 / 23",
    tipo: "Propios",
    Estado: "realizado",
  },
]);


//Datos Generados Clientes
const clientes = ref([
  {
    id: 1,
    nombre: "Jose Vargas Lopez",
    celular: "888888888",
    fecha: "23 / 25 / 23",
    tipo: "Propios",
    Vendido: "seleccionar",
  },
]);



// Guardar Lead ESTADO
const guardarLead = (leadData: any) => {
  leads.value.push({
    id: leads.value.length + 1,
    estado: "Seguimiento",
    ...leadData,
  });
};

// Guardar Cita ESTADO
const guardarLeadCitas = (leadDataCitas: any) => {
  citas.value.push({
    id: citas.value.length + 1,
    Estado: "realizado",
    ...leadDataCitas,
  });
};



// Guardar Cliente ESTADO
const guardarLeadClientes = (leadDataClientes: any) => {
  clientes.value.push({
    id: clientes.value.length + 1,
    Vendido: "seleccionar",
    ...leadDataClientes,
  });
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
      <TablaLeads :leads="leads" :estados="estados" />
    </div>
<!------------------------------------------------------TABLA DE CITAS----------------------------------------------------------------------->
    <div v-else-if="currentTab === 'Citas'">
      <TablaCitas :citas="citas" :estadosCitas="estadosCitas" />
    </div>
<!------------------------------------------------------TABLA DE CLIENTES----------------------------------------------------------------------->
    <div v-else-if="currentTab === 'Clientes'">
      <TablaClientes :clientes="clientes" :VendidoClientes="VendidoClientes" />
    </div>

    <!-- Modal Agregar Nuevo Lead -->
    <NuevoLeadForm v-if="showNuevoLeadForm" @close="showNuevoLeadForm = false" />
  </div>
</template>
