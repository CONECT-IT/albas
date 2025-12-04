<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  propiedadesDisponibles?: {
    id: number;
    nombre: string;
    fecha: string;
    hora: string;
    cliente: string;
    direccion: string;
  }[];
}>();

const emit = defineEmits(["close"]);

// --- FORMULARIO LOCAL ---
const form = ref({
  propiedadId: "",
});

// Lista de propiedades (mock si no vienen del padre)
const listaPropiedades = computed(() => props.propiedadesDisponibles || [
  {
    id: 1,
    nombre: 'Vista Hermosa',
    fecha: "2025-02-10",
    hora: "10:30",
    cliente: "Carlos Mendoza",
    direccion: "Col. Centro #123"
  },
  {
    id: 2,
    nombre: 'Lote Centro',
    fecha: "2025-02-12",
    hora: "14:00",
    cliente: "Ana Ramírez",
    direccion: "Av. Reforma 456"
  },
  {
    id: 3,
    nombre: 'Residencial Los Álamos',
    fecha: "2025-02-15",
    hora: "16:45",
    cliente: "Luis Torres",
    direccion: "Residencial Los Álamos #55"
  }
]);

// Datos seleccionados
const datosVisita = ref({
  fecha: "",
  hora: "",
  cliente: "",
  direccion: "",
});

// --- Cargar datos cuando el usuario selecciona propiedad ---
watch(() => form.value.propiedadId, (nuevoId) => {
  const seleccion = listaPropiedades.value.find(p => p.id == nuevoId);

  if (seleccion) {
    datosVisita.value = {
      fecha: seleccion.fecha,
      hora: seleccion.hora,
      cliente: seleccion.cliente,
      direccion: seleccion.direccion
    };
  }
});
</script>

<template>
  <!-- Fondo desenfocado -->
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
    @click="$emit('close')"
  ></div>

  <!-- Contenedor -->
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
    
    <div
      class="bg-white rounded-[28px] shadow-2xl p-10 w-[650px] border border-gray-200 pointer-events-auto relative"
    >
      <!-- Botón cerrar -->
      <button
        class="absolute top-6 right-6 text-gray-500 hover:text-black transition p-1 rounded-full hover:bg-gray-100"
        @click="$emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
             class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Título -->
      <h2 class="text-2xl font-bold">Programación de Visitas</h2>
      <p class="text-gray-400 text-sm mt-1 mb-6">Seleccione una propiedad</p>

      <!-- SELECT DE PROPIEDADES -->
      <div class="relative mb-8">
        <select
          v-model="form.propiedadId"
          class="w-full bg-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 shadow-inner appearance-none cursor-pointer"
        >
          <option value="" disabled>Seleccionar...</option>

          <option 
            v-for="prop in listaPropiedades"
            :key="prop.id"
            :value="prop.id"
          >
            {{ prop.nombre }}
          </option>
        </select>

        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
               class="w-4 h-4 opacity-50">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <!-- Caja de tabla -->
      <div class="bg-gray-100 rounded-[22px] shadow-inner overflow-hidden border border-gray-300/70">
        
        <!-- Título interno -->
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-300 bg-white/70">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
           </svg>
          <span class="text-md font-semibold">Citas Programadas</span>
        </div>

        <!-- Tabla -->
        <table class="w-full text-sm text-black">
          <thead class="bg-white/70 border-b border-gray-300">
            <tr>
              <th class="py-3 px-4 text-left font-semibold">Fecha</th>
              <th class="py-3 px-4 text-left font-semibold">Hora</th>
              <th class="py-3 px-4 text-left font-semibold">Cliente</th>
              <th class="py-3 px-4 text-left font-semibold">Dirección</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="py-3 px-4">{{ datosVisita.fecha }}</td>
              <td class="py-3 px-4">{{ datosVisita.hora }}</td>
              <td class="py-3 px-4">{{ datosVisita.cliente }}</td>
              <td class="py-3 px-4">{{ datosVisita.direccion }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
