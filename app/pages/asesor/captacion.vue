<script setup lang="ts">
import { ref } from 'vue';
definePageMeta({
  layout: 'asesor', 
});

// Variable reactiva para controlar qué pestaña está activa
const currentTab = ref('Leads'); // Inicia en 'Leads'

// Función para cambiar la pestaña activa
const setTab = (tabName: string) => {
    currentTab.value = tabName;
};
</script>

<template>
  <div class="p-8">
    
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
        
        <button 
            class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md 
                   bg-white text-negro-primario border border-gray-200"
        >
            + Agregar Lead
        </button>
    </div>
    
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

  </div>
</template>