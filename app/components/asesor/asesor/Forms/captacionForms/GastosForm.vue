<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  cita?: any; 
  propiedadesDisponibles?: any[];
}>();

const emit = defineEmits(["close", "crear"]);

// --- ESTADO ---
const propiedadSeleccionadaId = ref<number | string>("");

// Formulario
const form = ref({
  concepto: "",
  monto: "",
  categoria: "",
  fecha: new Date().toISOString().split('T')[0]
});

// Lista de gastos
const listaGastos = ref<any[]>([
  { id: 1, categoria: 'Transporte', concepto: 'Ejemplo: Taxi para visita de propiedad', monto: '15.00', fecha: '2025-11-20' }
]);

// ID del gasto que se está editando
const idEditando = ref<number | null>(null);

// Mock propiedades
const listaPropiedades = computed(() => props.propiedadesDisponibles || [
  { id: 1, nombre: 'Vista Hermosa' },
  { id: 2, nombre: 'Lote Centro' }
]);

// -------------------- AGREGAR / EDITAR ---------------------
const guardarGasto = () => {
  if (!form.value.concepto || !form.value.monto) return;

  if (idEditando.value !== null) {
    // MODO EDICIÓN
    const index = listaGastos.value.findIndex(g => g.id === idEditando.value);
    if (index !== -1) {
      listaGastos.value[index] = {
        id: idEditando.value,
        categoria: form.value.categoria || "General",
        concepto: form.value.concepto,
        monto: Number(form.value.monto).toFixed(2),
        fecha: form.value.fecha,
      };
    }

    idEditando.value = null;
  } else {
    // MODO AGREGAR
    listaGastos.value.unshift({
      id: Date.now() + Math.random(),
      categoria: form.value.categoria || "General",
      concepto: form.value.concepto,
      monto: Number(form.value.monto).toFixed(2),
      fecha: form.value.fecha
    });
  }

  // limpiar campos
  form.value.concepto = "";
  form.value.monto = "";
  form.value.categoria = "";
  form.value.fecha = new Date().toISOString().split("T")[0];
};

const editarGasto = (item: any) => {
  idEditando.value = item.id;

  form.value.categoria = item.categoria;
  form.value.concepto = item.concepto;
  form.value.monto = item.monto;
  form.value.fecha = item.fecha;
};

const cancelarEdicion = () => {
  idEditando.value = null;
  form.value.concepto = "";
  form.value.monto = "";
  form.value.categoria = "";
  form.value.fecha = new Date().toISOString().split("T")[0];
};

// -------------------- ELIMINAR ---------------------
const eliminarGasto = (id: number | string) => {
  listaGastos.value = listaGastos.value.filter(g => g.id !== id);
  if (idEditando.value === id) cancelarEdicion();
};

// -------------------- GUARDAR TODO ---------------------
const guardarCambios = () => {
  if (!propiedadSeleccionadaId.value) return;

  emit("crear", {
    propiedadId: propiedadSeleccionadaId.value,
    gastos: listaGastos.value
  });

  emit("close");
};
</script>

<template>
  <!-- Overlay -->
  <div 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
    @click="$emit('close')"
  ></div>

  <!-- Modal Container -->
  <div class="fixed inset-0  flex items-center justify-center z-40 pointer-events-none p-4">
    <div class="bg-white rounded-[24px] p-0 shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden pointer-events-auto font-sans relative border border-gray-100 flex flex-col">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Nuevo Gasto</h2>
          <p class="text-xs text-gray-500 mt-1">Agregue los gastos a la lista antes de guardar.</p>
        </div>
        <button 
          class="text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-2"
          @click="$emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto p-8 custom-scrollbar flex-grow">
        
        <!-- Selector de Propiedad -->
        <div class="mb-8">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Propiedad</label>
          <div class="relative w-full max-w-sm">
            <select 
              v-model="propiedadSeleccionadaId"
              class="w-full appearance-none bg-[#E0E0E0] rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer shadow-inner"
            >
              <option value="" disabled selected>Seleccionar...</option>
              <option v-for="prop in listaPropiedades" :key="prop.id" :value="prop.id">
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

        <!-- Formulario Agregar Gasto -->
        <div class="border border-gray-300 rounded-[24px] p-6 mb-8 relative bg-white shadow-sm">
          <h3 class="text-sm font-bold text-black mb-5 flex items-center gap-2">
            <span class="w-2 h-2 bg-black rounded-full"></span>
            {{ idEditando ? "Editar Categoría" : "Agregar Nueva Categoría" }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            
            <!-- Columna 1 -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-black mb-1.5 ml-1">Concepto</label>
                <input v-model="form.concepto" type="text" placeholder="Descripción del gasto" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 px-4 text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 border border-transparent transition-all shadow-inner">
              </div>

              <div>
                <label class="block text-xs font-bold text-black mb-1.5 ml-1">Monto</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">$</span>
                  <input v-model="form.monto" type="number" placeholder="0.00" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 pl-7 pr-4 text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 border border-transparent transition-all shadow-inner">
                </div>
              </div>
            </div>

            <!-- Columna 2 -->
            <div class="space-y-4 relative flex flex-col">
              <div>
                <label class="block text-xs font-bold text-black mb-1.5 ml-1">Categoría</label>
                <input v-model="form.categoria" type="text" placeholder="General" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 px-4 text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 border border-transparent transition-all shadow-inner">
              </div>

              <div>
                <label class="block text-xs font-bold text-black mb-1.5 ml-1">Fecha</label>
                <div class="relative">
                  <input v-model="form.fecha" type="date" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 border border-transparent transition-all shadow-inner">
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
                  </div>
                </div>
              </div>

              <div class="mt-auto flex justify-end pt-4">
                 <button 
                    @click="guardarGasto"
                    class="bg-black hover:bg-gray-800 text-white rounded-xl w-12 h-12 flex items-center justify-center transition-all shadow-lg active:scale-95"
                    :title="idEditando ? 'Actualizar gasto' : 'Agregar a la tabla'"
                  >
                    <!-- Ícono actualizar -->
                    <svg v-if="idEditando" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>

                    <!-- Ícono agregar -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>

                  <button 
                    v-if="idEditando"
                    @click="cancelarEdicion"
                    class="ml-2 bg-gray-300 hover:bg-gray-400 text-black rounded-xl w-12 h-12 flex items-center justify-center shadow active:scale-95"
                    title="Cancelar edición"
                  >
                    ✕
                  </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">

          <div class="grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] bg-black text-white px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-center items-center">
            <span class="text-left pl-2">Categoría</span>
            <span class="text-left">Concepto</span>
            <span class="text-left">Monto</span>
            <span>Fecha</span>
            <span class="text-right pr-3">Acción</span>
          </div>

          <div class="divide-y divide-gray-100 bg-white min-h-[100px]">

            <div v-if="listaGastos.length === 0" class="py-8 text-center text-gray-400 italic text-sm">
              No hay gastos agregados.
            </div>

            <div 
              v-for="gasto in listaGastos" 
              :key="gasto.id"
              class="grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] px-4 py-3.5 items-center text-center hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <span class="text-left font-bold text-gray-800 pl-2 text-xs bg-gray-100 px-2 py-1 rounded w-fit">{{ gasto.categoria }}</span>
              <span class="text-left font-medium text-gray-600 text-sm truncate">{{ gasto.concepto }}</span>
              <span class="text-left font-extrabold text-black text-sm">$ {{ gasto.monto }}</span>
              <span class="text-xs text-gray-500">{{ gasto.fecha }}</span>

              <!-- Acciones -->
              <div class="flex justify-end pr-2 gap-3">

                <!-- EDITAR -->
                <button 
                  @click="editarGasto(gasto)"
                  class="text-gray-500 hover:text-black transition"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 
                      1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 
                      4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 
                      4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                  </svg>
                </button>

                <!-- ELIMINAR -->
                <button @click="eliminarGasto(gasto.id)" class="text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 
                        2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 
                        0 0 1-2.244-2.077L4.772 5.79m14.456 
                        0a48.108 48.108 0 0 0-3.478-.397m-12 
                        .562c.34-.059.68-.114 1.022-.165m0 0a48.11 
                        48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                        51.964 0 0 0-3.32 0c-1.18.037-2.09 
                        1.022-2.09 2.201v.916m7.5 0a48.667 
                        48.667 0 0 0-7.5 0" />
                  </svg>
                </button>

              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
        <button 
          @click="$emit('close')"
          class="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-100 transition-colors shadow-sm"
        >
          Cancelar
        </button>
        <button 
          @click="guardarCambios"
          class="px-8 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          Guardar Cambios
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer; opacity: 0; position: absolute; right: 0; top: 0; bottom: 0; width: 40px;
}
</style>
