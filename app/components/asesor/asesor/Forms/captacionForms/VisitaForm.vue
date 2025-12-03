<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  lead?: any; 
  propiedadesDisponibles?: any[];
}>();

const emit = defineEmits(["close", "crear"]);

// --- DATOS DEL FORMULARIO ---
const form = ref({
  propiedadId: "",
  fecha: "",
  hora: ""
});

// Mock de propiedades (si no llegan props)
const listaPropiedades = computed(() => props.propiedadesDisponibles || [
  { id: 1, nombre: 'Vista Hermosa' },
  { id: 2, nombre: 'Lote Centro' },
  { id: 3, nombre: 'Residencial Los Álamos' }
]);
const handleSubmit = () => {
  emit("crear", {
    leadId: props.lead?.id,
    ...form.value
  });
  emit("close");
};
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
    @click="$emit('close')"
  ></div>

  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
    <div class="bg-white rounded-[24px] p-8 shadow-2xl w-full max-w-[500px] pointer-events-auto font-sans relative border border-gray-100 flex flex-col">
      
      <button 
        class="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors rounded-full p-1 hover:bg-gray-100"
        @click="$emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-2xl font-bold text-black mb-6">Programar Visita</h2>

      <div class="space-y-6">
        
        <div>
          <label class="block text-xs text-gray-400 mb-2 ml-1">Seleccione una propiedad</label>
          <div class="relative">
            <select 
              v-model="form.propiedadId"
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

        <div>
          <label class="block text-sm font-bold text-black mb-2 ml-1">Fecha de la Visita</label>
          <div class="relative">
            <input 
              v-model="form.fecha"
              type="date"
              class="w-full bg-[#E0E0E0] rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-inner"
            />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-1.5 ml-1">Seleccione la fecha de la visita</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-black mb-2 ml-1">Hora de la Visita</label>
          <div class="relative">
            <input 
              v-model="form.hora"
              type="time"
              class="w-full bg-[#E0E0E0] rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-inner"
            />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-1.5 ml-1">Hora local en formato de 24 horas</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-8 pt-4">
        <button 
          @click="$emit('close')"
          class="px-8 py-2.5 border border-gray-400 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button 
          @click="handleSubmit"
          class="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Programar Visita
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
}
</style>