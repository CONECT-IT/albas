<script setup lang="ts">
import { ref, defineEmits } from "vue";
// Props
interface LeadClientes {
  id: number;
  nombre: string;
  celular: string;
  fecha: string;
  tipo: string;
  Vendido: string;
}

defineProps<{
  clientes: LeadClientes[];
  VendidoClientes: string[];
}>();
const emit = defineEmits(["guardar", "eliminar"]);
const confirmarRefEliminar = ref<InstanceType<typeof ConfirmarEliminar> | null>(null);
//---------------------------------------------------MOSTRAR MODAL --------------------------------------------------------------------
// Modal - HISTORIAL
const showVerHistorialForm = ref(false);
// Modal - PROPIEDADES
const showVerPropiedadForm = ref(false);
// Modal - CONTRATO
const showSubirContratoForm = ref(false);
// Modal - OBSERVACION
const showVerObservacionForm = ref(false);
// Modal - EDITAR LEAD
const showEditarLeadForm = ref(false);

// Lead seleccionado
const selectedCliente = ref<LeadClientes | null>(null);

// Funciones para abrir modales
const openForm = (cliente: LeadClientes, formType: string) => {
  selectedCliente.value = cliente;
  const formMap: { [key: string]: any } = {
    verHistorial: showVerHistorialForm,
    verPropiedad: showVerPropiedadForm,
    subirContrato: showSubirContratoForm,
    verObservacion: showVerObservacionForm,
    editarLead: showEditarLeadForm,
  };
  const form = formMap[formType];
  if (form) form.value = true;
};

// Función para cerrar modal
const closeForm = (formType: string) => {
  const formMap: { [key: string]: any } = {
    verHistorial: showVerHistorialForm,
    verPropiedad: showVerPropiedadForm,
    subirContrato: showSubirContratoForm,
    verObservacion: showVerObservacionForm,
    editarLead: showEditarLeadForm,
  };
  const form = formMap[formType];
  if (form) form.value = false;
};
</script>

<template>
  <div class="bg-blanco-primario p-4 rounded-xl shadow-xl overflow-x-auto">
    <!------------------------------Buscador-------------------------------->
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
          type="text"
          placeholder="Buscar por nombre, apellido..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!------------------------Header tabla------------------------------------------->
    <div
      class="grid grid-cols-12 gap-x-1 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200"
    >
      <span>N°</span>
      <span class="col-span-2 -ml-18">Nombre Completo</span>
      <span class="-ml-25">Contacto</span>
      <span class="-ml-22">Fecha</span>
      <span class="-ml-24">Tipo</span>
      <span class="-ml-24">Historial</span>
      <span class="-ml-20">Propiedades</span>
      <span class="-ml-15">Contrato</span>
      <span class="-ml-15">Vendido</span>
      <span class="-ml-12">Observaciones</span>
      <span>Acciones</span>
    </div>

    <!-- Filas de datos alvas -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="cliente in clientes"
        :key="cliente.id"
        class="grid grid-cols-12 gap-x-4 py-3 px-4 text-sm text-gray-800 items-center"
      >
        <!-- Datos del lead -->
        <span>{{ cliente.id }}</span>
        <span class="col-span-2 -ml-19">{{ cliente.nombre }}</span>
        <span class="-ml-27">{{ cliente.celular }}</span>
        <span class="-ml-27">{{ cliente.fecha }}</span>
        <span class="-ml-26">{{ cliente.tipo }}</span>

        <!-- BOTONES DE HISTORIAL-->
        <span class="flex items-center space-x-1 -ml-18">
          <!--Ver Historial-->
          <button
            @click="openForm(cliente, 'verHistorial')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 -ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </span>

        <!-- BOTONES PROPIEDAD -->
        <span class="flex items-center space-x-1 -ml-18">
          <!--VER INFORMACION PROPIEDAD-->
          <button
            @click="openForm(cliente, 'verPropiedad')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </button>
        </span>

        <!-- BOTONES SUBIR ARCHIVO -->
        <span class="flex items-center space-x-1 -ml-18">
          <button
            @click="openForm(cliente, 'subirContrato')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </button>
        </span>

        <!--BOTON DE ACCION VENDIDO -->
        <span class="relative">
          <select v-model="cliente.Vendido" class="border rounded px-2 py-1 text-sm -ml-21">
            <option v-for="e in VendidoClientes" :key="e" :value="e">{{ e }}</option>
          </select>
        </span>

        <!--BOTON DE OBSERVACION----->
        <span class="flex items-center space-x-1 -ml-18">
          <!--Ver Observacion-->
          <button
            @click="openForm(cliente, 'verObservacion')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-13"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </span>

        <!---------BOTON ACCIONES--------->
        <span class="flex space-x-2">
          <!--Editar lead-->
          <button
            @click="openForm(cliente, 'editarLead')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 -ml-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-5.5 h-5.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>

          <!--eliminar lead -->
          <button
            @click="confirmarRefEliminar?.confirmarEliminar(() => emit('eliminar', cliente.id))"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!--------------------------------------------------------------MODAl-------------------------------------------------------------->
    <!-- MODAL - HISTORIAL -->
    <VerHistorialForm
      v-if="showVerHistorialForm"
      :cita="selectedCliente"
      @close="closeForm('verHistorial')"
    />
    <!-- MODAL PROPIEDADES -->
    <VerPropiedadForm
      v-if="showVerPropiedadForm"
      :cita="selectedCliente"
      @close="closeForm('verPropiedad')"
    />
    <!--MODAL CONTRATO -->
    <SubirContratoForm
      v-if="showSubirContratoForm"
      :cita="selectedCliente"
      @close="closeForm('subirContrato')"
    />

    <!--MODAL OBSERVACIONES-->
    <VerObservacionForm
      v-if="showVerObservacionForm"
      :cita="selectedCliente"
      @close="closeForm('verObservacion')"
    />
    <!--MODAL ACCIONES -->
    <EditarLeadForm
      v-if="showEditarLeadForm"
      :cita="selectedCliente"
      @close="closeForm('editarLead')"
    />
    <ConfirmarEliminar ref="confirmarRefEliminar" />
  </div>
</template>
