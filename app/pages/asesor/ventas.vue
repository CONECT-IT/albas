<script setup lang="ts">
import { ref } from 'vue';
import NuevoLeadForm from '~/components/asesor/NuevoLeadForm.vue';
definePageMeta({
  layout: 'asesor', 
});

// Control de pestañas
const currentTab = ref('Leads');
const setTab = (tabName: string) => {
    currentTab.value = tabName;
};
//control del modal
const showModal = ref(false);

// Capturar datos cuando se cree un Lead
const guardarLead = (leadData: any) => {
  console.log("Nuevo Lead creado:", leadData);
};
</script>

<template>
  <div class="p-8">
    
    <!-- Encabezado de Botones-->
    <div class="flex justify-between items-center mb-6">
        
        <div class="flex space-x-2">
            
            <button 
                @click="setTab('Leads')"
                class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
                :class="{
                    'bg-negro-primario text-white': currentTab === 'Leads',
                    'bg-white text-negro-primario': currentTab !== 'Leads'
                }"
            >
                Leads
            </button>

            <button 
                @click="setTab('Citas')"
                class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
                :class="{
                    'bg-negro-primario text-white': currentTab === 'Citas',
                    'bg-white text-negro-primario': currentTab !== 'Citas'
                }"
            >
                Citas
            </button>

            <button 
                @click="setTab('Clientes')"
                class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
                :class="{
                    'bg-negro-primario text-white': currentTab === 'Clientes',
                    'bg-white text-negro-primario': currentTab !== 'Clientes'
                }"
            >
                Clientes
            </button>
        </div>
        <!--Boton agregar lead-->
        <button 
            class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md 
                   bg-white text-negro-primario border border-gray-200"
            @click="showModal = true"
        >
            + Agregar Lead
        </button>
    </div>
    
    <!-- Tabla 1: Leads-->
    <div v-if="currentTab === 'Leads'" class="bg-white p-4 rounded-xl shadow-xl overflow-x-auto">
        <div class="grid grid-cols-12 gap-x-4 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
            <span>N°</span>
            <span class="col-span-2">Nombre Completo</span>
            <span>Celular</span>
            <span>Fecha</span>
            <span>Tipo</span>
            <span>Propiedad</span>
            <span>Visita</span>
            <span>Observación</span>
            <span>Estado</span>
            <span>Acciones</span>
            <span>Guardar</span> 
        </div>

        <div class="divide-y divide-gray-100">
            <div v-for="n in 7" :key="'lead-row-'+n" class="grid grid-cols-12 gap-x-4 py-3 px-4 text-sm text-gray-800 min-h-[50px] items-center">
                <span></span> 
                <span class="col-span-2"></span> 
                <span></span> 
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span> 
            </div>
        </div>
    </div>

     <!-- Tabla 2: Citas -->
    <div v-else-if="currentTab === 'Citas'" class="bg-white p-4 rounded-xl shadow-xl overflow-x-auto">
        
        <div class="grid grid-cols-11 gap-x-4 py-4 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
            <span>N°</span>
            <span class="col-span-2">Nombre Completo</span>
            <span>Celular</span>
            <span>Propiedades</span>
            <span>Visitas</span>
            <span>Gastos</span>
            <span>Observación</span>
            <span>Estado</span>
            <span>Acciones</span>
            <span>Guardar</span>
        </div>

        <div class="divide-y divide-gray-100">
            <div v-for="n in 7" :key="'cita-row-'+n" class="grid grid-cols-10 gap-x-4 py-3 px-4 text-sm text-gray-800 min-h-[50px] items-center">
                <span></span> 
                <span class="col-span-2"></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
            </div>
        </div>
    </div>

    <!-- Tabla 3: Clientes -->
    <div v-else-if="currentTab === 'Clientes'" class="bg-white p-4 rounded-xl shadow-xl overflow-x-auto">
        
        <div class="mb-4">
            <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, apellido..." 
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>

        <div class="grid grid-cols-11 gap-x-4 py-3 px-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
            <span>N°</span>
            <span class="col-span-2">Nombre Completo</span>
            <span>Contacto</span>
            <span>Fecha</span>
            <span>Tipo</span>
            <span>Historial</span>
            <span>Propiedades</span>
            <span>Vendido</span>
            <span>Observaciones</span>
            <span>Acciones</span>
        </div>

        <div class="divide-y divide-gray-100">
            <div v-for="n in 7" :key="'cliente-row-'+n" class="grid grid-cols-11 gap-x-4 py-3 px-4 text-sm text-gray-800 min-h-[50px] items-center">
                <span class="col-span-2"></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span> 
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
     <!-- Modal para crear lead-->
    <NuevoLeadForm 
      v-if="showModal"
      @close="showModal = false"
      @crear="guardarLead"
    />
  </div>
</template>
