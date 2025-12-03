<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits(['close']);

// --- MOCK DATA: PROPIEDADES ---
const propiedades = [
  { id: 1, nombre: 'Vista Hermosa' },
  { id: 2, nombre: 'Residencial Los Álamos' },
  { id: 3, nombre: 'Edificio Sky View' }
];

// --- MOCK DATA: CITAS ---
const citas = [
  { id: 101, propId: 1, fecha: '2025-11-14', hora: '10:00', direccion: 'Av. Principal #123, Centro' },
  { id: 102, propId: 1, fecha: '2025-11-14', hora: '12:00', direccion: 'Av. Principal #123, Centro' },
  { id: 103, propId: 2, fecha: '2025-12-01', hora: '09:00', direccion: 'Calle Los Pinos 45, Norte' },
];

// --- MOCK DATA: GASTOS ---
const gastos = [
  { id: 201, propId: 1, fecha: '2025-11-10', concepto: 'Publicidad en Facebook', categoria: 'Marketing', monto: 4000 },
  { id: 202, propId: 1, fecha: '2025-11-10', concepto: 'Publicidad en Facebook', categoria: 'Marketing', monto: 4000 },
  { id: 203, propId: 1, fecha: '2025-11-10', concepto: 'Publicidad en Facebook', categoria: 'Marketing', monto: 4000 },
  { id: 204, propId: 2, fecha: '2025-11-20', concepto: 'Limpieza', categoria: 'Mantenimiento', monto: 150 },
];

// --- ESTADO ---
const propiedadSeleccionadaId = ref(1);
const clienteNombre = "Jose Mamani Lopez";

// --- LÓGICA COMPUTADA (FILTROS) ---
const citasFiltradas = computed(() => 
  citas.filter(c => c.propId === propiedadSeleccionadaId.value)
);

const gastosFiltrados = computed(() => 
  gastos.filter(g => g.propId === propiedadSeleccionadaId.value)
);

const totalCitas = computed(() => citasFiltradas.value.length);
const totalGastosCount = computed(() => gastosFiltrados.value.length);

// NUEVO: Suma total de los gastos mostrados
const totalMontoGastos = computed(() => {
  return gastosFiltrados.value.reduce((total, gasto) => total + gasto.monto, 0);
});

// --- FORMATEADORES ---
const formatoFechaLarga = (fechaStr: string) => {
  if (!fechaStr) return '';
  const date = new Date(fechaStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' 
  });
};

const formatoMoneda = (monto) => {
    let valor = new
  Intl.NumberFormat('en-PE', {
    style: 'currency', currency: 'PEN', minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(monto);

  return valor.replace('PEN', 'S/.');
};
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
    @click="$emit('close')"
  ></div>

  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
    
    <div class="bg-white rounded-[30px] shadow-2xl w-full max-w-[800px] pointer-events-auto relative border border-gray-200 flex flex-col max-h-[95vh]">
      
      <div class="p-8 pb-4 flex-shrink-0">
        <h2 class="text-sm font-bold text-center text-black mb-6">
          Historial Cliente: {{ clienteNombre }}
        </h2>

        <button 
          @click="$emit('close')"
          class="absolute top-6 right-6 text-gray-800 hover:text-gray-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <label class="block text-xs text-gray-400 font-medium mb-2 pl-1">Seleccione una propiedad</label>
          <div class="relative w-full md:w-1/2"> 
            <select 
              v-model="propiedadSeleccionadaId"
              class="w-full appearance-none bg-[#E0E0E0] rounded-xl py-2 pl-4 pr-10 text-sm font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option v-for="prop in propiedades" :key="prop.id" :value="prop.id">
                {{ prop.nombre }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8 pt-0 overflow-y-auto space-y-8 pb-10">

        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div class="bg-black text-white px-6 py-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>
            <span class="font-medium text-sm">Resumen</span>
          </div>
          
          <div class="bg-gradient-to-b from-gray-100 to-white p-6 flex gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 py-6 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-black">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span class="text-2xl font-bold text-black">{{ totalCitas }}</span>
              <span class="text-xs font-medium text-black">Citas</span>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 py-6 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-black">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span class="text-2xl font-bold text-black">{{ formatoMoneda(totalMontoGastos) }}</span>
              <span class="text-xs font-medium text-black">Total Gastado</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
           <div class="bg-black text-white px-6 py-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span class="font-medium text-sm">1. Citas Programadas</span>
          </div>

          <div class="bg-gray-100 px-6 py-2 text-xs font-bold text-black border-b border-gray-200">
            Total de citas registradas: {{ totalCitas }}
          </div>

          <div class="bg-gradient-to-b from-gray-50 to-white p-4">
            <div class="grid grid-cols-3 gap-4 px-2 mb-3">
              <span class="text-xs font-bold text-black/70">Fecha</span>
              <span class="text-xs font-bold text-black/70">Hora</span>
              <span class="text-xs font-bold text-black/70 text-right">Dirección</span>
            </div>

            <div class="space-y-3">
              <div v-if="totalCitas === 0" class="text-center text-xs text-gray-400 py-4">Sin citas.</div>
              
              <div 
                v-for="cita in citasFiltradas" 
                :key="cita.id" 
                class="grid grid-cols-3 gap-4 px-2 py-3 bg-white/50 rounded-lg border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
              >
                <span class="text-xs font-bold text-black">{{ formatoFechaLarga(cita.fecha) }}</span>
                <span class="text-xs font-bold text-black">{{ cita.hora }}</span>
                <span class="text-xs font-bold text-black text-right truncate" :title="cita.direccion">{{ cita.direccion }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
           <div class="bg-black text-white px-6 py-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span class="font-medium text-sm">2. Gastos Registrados</span>
          </div>

          <div class="bg-gradient-to-b from-gray-50 to-white p-4">
            <div class="grid grid-cols-4 gap-2 px-2 mb-3">
              <span class="text-xs font-bold text-black/70">Fecha</span>
              <span class="text-xs font-bold text-black/70 col-span-2">Concepto</span>
              <span class="text-xs font-bold text-black/70 text-right">Monto</span>
            </div>

             <div class="space-y-3">
              <div v-if="totalGastosCount === 0" class="text-center text-xs text-gray-400 py-4">Sin gastos.</div>

              <div 
                v-for="gasto in gastosFiltrados" 
                :key="gasto.id" 
                class="grid grid-cols-4 gap-2 px-2 py-3 bg-white/50 rounded-lg border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
              >
                <span class="text-xs font-bold text-black">{{ formatoFechaLarga(gasto.fecha) }}</span>
                <span class="text-xs font-bold text-black col-span-2 flex flex-col">
                  <span>{{ gasto.concepto }}</span>
                  <span class="text-[10px] text-gray-500 font-normal">{{ gasto.categoria }}</span>
                </span>
                <span class="text-xs font-bold text-black text-right">{{ formatoMoneda(gasto.monto) }}</span>
              </div>
            </div>

            <div v-if="totalGastosCount > 0" class="mt-6 pt-4 border-t border-gray-300 flex justify-end items-center gap-6">
                <span class="text-sm font-bold text-gray-500  tracking-wide">Monto Total</span>
                <span class="text-2xl font-black text-black">{{ formatoMoneda(totalMontoGastos) }}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>