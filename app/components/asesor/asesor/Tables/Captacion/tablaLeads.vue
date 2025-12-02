<script setup lang="ts">
import { ref } from "vue";

//--------------------------------Importar todos los formularios------------------------------

import PropiedadForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import EditarPropiedadForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import VerPropiedadForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import VisitaForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import EditarVisitaForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import VerVisitaForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import ObservacionForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import EditarObservacionForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import VerObservacionForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import EditarLeadForm from "~/components/asesor/asesor/Forms/captacionForms/NuevoLeadForm.vue";
import ConfirmarGuardar from "~/components/asesor/asesor/Forms/captacionForms/ConfirmarGuardar.vue";
import ConfirmarEliminar from "~/components/asesor/asesor/Forms/captacionForms/ConfirmarEliminar.vue";
// Props
interface Lead {
  id: number;
  nombre: string;
  celular: string;
  fecha: string;
  tipo: string;
  estado: string;
}

const props = defineProps<{
  leads: Lead[];
  estados: string[];
}>();

/* ---------------------EMIT PARA CAPTACION.VUE--------------------- */
const emit = defineEmits(["guardar","eliminar"]);

const confirmarRefGuardar = ref<InstanceType<typeof ConfirmarGuardar> | null>(null);
const confirmarRefEliminar = ref<InstanceType<typeof ConfirmarEliminar> | null>(null);
//---------------------------------------------------MOSTRAR MODAL--------------------------------------------------------------------
// Modal - Propiedad
const showPropiedadForm = ref(false);
const showEditarPropiedadForm = ref(false);
const showVerPropiedadForm = ref(false);

// Modal - Visita
const showVisitaForm = ref(false);
const showEditarVisitaForm = ref(false);
const showVerVisitaForm = ref(false);

// Modal - Observación
const showObservacionForm = ref(false);
const showEditarObservacionForm = ref(false);
const showVerObservacionForm = ref(false);

// Modal - ACCIONES
const showEditarLeadForm = ref(false);
// Lead seleccionado
const selectedLead = ref<Lead | null>(null);

// Funciones para abrir modales
const openForm = (lead: Lead, formType: string) => {
  selectedLead.value = lead;
  const formMap: { [key: string]: any } = {
    propiedad: showPropiedadForm,
    editarPropiedad: showEditarPropiedadForm,
    verPropiedad: showVerPropiedadForm,
    visita: showVisitaForm,
    editarVisita: showEditarVisitaForm,
    verVisita: showVerVisitaForm,
    observacion: showObservacionForm,
    editarObservacion: showEditarObservacionForm,
    verObservacion: showVerObservacionForm,
    editarLead: showEditarLeadForm,
  };
  if (formMap[formType]) formMap[formType].value = true;
};

// Función para cerrar modal
const closeForm = (formType: string) => {
  const formMap: { [key: string]: any } = {
    propiedad: showPropiedadForm,
    editarPropiedad: showEditarPropiedadForm,
    verPropiedad: showVerPropiedadForm,
    visita: showVisitaForm,
    editarVisita: showEditarVisitaForm,
    verVisita: showVerVisitaForm,
    observacion: showObservacionForm,
    editarObservacion: showEditarObservacionForm,
    verObservacion: showVerObservacionForm,
    editarLead: showEditarLeadForm,
  };
  if (formMap[formType]) formMap[formType].value = false;
};
</script>

<template>
  <div class="bg-blanco-primario p-4 rounded-xl shadow-xl overflow-x-auto">

    <!--------------------------------------- Header tabla -------------------------------------->
    <div
      class="grid grid-cols-12 gap-x-1 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200"
    >
      <span class="mr-2">N°</span>
      <span class="col-span-2 -ml-15">Nombre Completo</span>
      <span class="-ml-18">Celular</span>
      <span class="-ml-15">Fecha</span>
      <span class="-ml-13">Tipo</span>
      <span class="-ml-14">Propiedad</span>
      <span class="-ml-7">Visita</span>
      <span class="-ml-7">Observación</span>
      <span class="ml-4">Estado</span>
      <span class="ml-7">Acciones</span>
      <span class="ml-11">Guardar</span>
    </div>

    <!---------------------------- Filas de la tabla(DATOS DE ALVAS) ------------------------->
    <div class="divide-y divide-gray-100">
      <div
        v-for="lead in props.leads"
        :key="lead.id"
        class="grid grid-cols-12 gap-x-4 py-3 px-4 text-sm text-gray-800 items-center"
      >
        <!-- Datos del lead -->
        <span>{{ lead.id }}</span>
        <span class="col-span-2 -ml-16">{{ lead.nombre }}</span>
        <span class="-ml-22">{{ lead.celular }}</span>
        <span class="-ml-20">{{ lead.fecha }}</span>
        <span class="-ml-16">{{ lead.tipo }}</span>

<!-- BOTONES PROPIEDAD -->
        <span class="flex items-center space-x-1 -ml-18">
          <!-- Agregar Propiedad -->
          <button
            @click="openForm(lead, 'propiedad')"
            class="bg-negro-primario rounded-full flex items-center justify-center w-6 h-6 text-blanco-primario shrink-0 -ml-1"
            title="Agregar Propiedad"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- Editar Propiedad -->
          <button
            @click="openForm(lead, 'editarPropiedad')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-1"
            title="Editar Propiedad"
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

          <!-- Ver Propiedad -->
          <button
            @click="openForm(lead, 'verPropiedad')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-1"
            title="Ver Propiedad"
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

<!-- BOTONES VISITA -->
        <span class="flex items-center space-x-1 -ml-18">
          <!-- Agregar Visita -->
          <button
            @click="openForm(lead, 'visita')"
            class="bg-negro-primario rounded-full flex items-center justify-center w-6 h-6 text-blanco-primario shrink-0 ml-5"
            title="Agregar Visita"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- Editar Visita -->
          <button
            @click="openForm(lead, 'editarVisita')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-1"
            title="Editar Visita"
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

          <!-- Ver Visita -->
          <button
            @click="openForm(lead, 'verVisita')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 -ml-1"
            title="Ver Visita"
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

<!-- BOTONES OBSERVACIÓN -->
        <span class="flex items-center space-x-1 -ml-18">
          <!-- Agregar Observación -->
          <button
            @click="openForm(lead, 'observacion')"
            class="bg-negro-primario rounded-full flex items-center justify-center w-6 h-6 text-blanco-primario shrink-0 ml-9"
            title="Agregar Observación"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- Editar Observación -->
          <button
            @click="openForm(lead, 'editarObservacion')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-1"
            title="Editar Observación"
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

          <!-- Ver Observación -->
          <button
            @click="openForm(lead, 'verObservacion')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 -ml-1"
            title="Ver Observación"
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

<!--BOTON ESTADO -->
        <span class="relative">
          <select v-model="lead.estado" class="border rounded px-2 py-1 text-sm -ml-6">
            <option v-for="e in props.estados" :key="e" :value="e">{{ e }}</option>
          </select>
        </span>

<!--BOTONES ACCIONES (Editar y Eliminar) -->
        <span class="flex space-x-2">
          <!-- Editar Lead -->
          <button
            @click="openForm(lead, 'editarLead')"
            class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0 ml-7"
            title="Editar Lead"
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

          <!-- Eliminar Lead -->
          <button
           @click="confirmarRefEliminar?.confirmarEliminar(() => emit('eliminar', lead.id))" class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario shrink-0"
            title="Eliminar Lead"
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

<!-- BOTON GUARDAR -->
        <span>
          <button
            @click="confirmarRefGuardar?.confirmar(() => emit('guardar', lead))" class="bg-blanco-primario rounded-full flex items-center justify-center w-6 h-6 text-negro-primario ml-13"
            title="Guardar"
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
                d="M3 7.5V6a2.25 2.25 0 0 1 2.25-2.25h10.5L21 8v10.5A2.25 2.25 0 0 1 18.75 20.75H5.25A2.25 2.25 0 0 1 3 18.75v-11.25Z"
              />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V8.25H7.5V3.75" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75v6" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15.75h6" />
            </svg>
          </button>
        </span>
      </div>
    </div>
<!--------------------------------------------------------------MODAl-------------------------------------------------------------->

<!-- MODAL - PROPIEDAD -->
    <PropiedadForm
      v-if="showPropiedadForm"
      :lead="selectedLead"
      @close="closeForm('propiedad')"
    />

    <EditarPropiedadForm
      v-if="showEditarPropiedadForm"
      :lead="selectedLead"
      @close="closeForm('editarPropiedad')"
    />

    <VerPropiedadForm
      v-if="showVerPropiedadForm"
      :lead="selectedLead"
      @close="closeForm('verPropiedad')"
    />

<!-- MODAL - VISITA -->
    <VisitaForm
      v-if="showVisitaForm"
      :lead="selectedLead"
      @close="closeForm('visita')"
    />

    <EditarVisitaForm
      v-if="showEditarVisitaForm"
      :lead="selectedLead"
      @close="closeForm('editarVisita')"
    />

    <VerVisitaForm
      v-if="showVerVisitaForm"
      :lead="selectedLead"
      @close="closeForm('verVisita')"
    />

<!-- MODAL - OBSERVACIÓN -->
    <ObservacionForm
      v-if="showObservacionForm"
      :lead="selectedLead"
      @close="closeForm('observacion')"
    />

    <EditarObservacionForm
      v-if="showEditarObservacionForm"
      :lead="selectedLead"
      @close="closeForm('editarObservacion')"
    />

    <VerObservacionForm
      v-if="showVerObservacionForm"
      :lead="selectedLead"
      @close="closeForm('verObservacion')"
    />

<!-- MODAL - EDITAR LEAD -->
    <EditarLeadForm
      v-if="showEditarLeadForm"
      :lead="selectedLead"
      @close="closeForm('editarLead')"
    />
    <ConfirmarGuardar ref="confirmarRefGuardar" />
    <ConfirmarEliminar ref="confirmarRefEliminar" />
  </div>
</template>