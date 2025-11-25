<script setup lang="ts">
import { ref } from 'vue';
definePageMeta({
  layout: 'asesor', 
});

// Control de pestañas
const currentTab = ref('Leads');
const setTab = (tabName: string) => {
    currentTab.value = tabName;
};


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
    
  </div>
</template>
