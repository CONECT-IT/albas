<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  lead?: any;
  visita?: any; // Objeto con los datos de la visita a editar
  propiedadesDisponibles?: any[]; // Lista FILTRADA de propiedades del lead
}>();

const emit = defineEmits(["close", "actualizar"]);

// --- DATOS DEL FORMULARIO ---
const form = ref({
  propiedadId: "",
  fecha: "",
  hora: "",
});

// Lista de propiedades (para el select)
const listaPropiedades = computed(() => props.propiedadesDisponibles || []);

// --- CARGAR DATOS AL ABRIR ---
onMounted(() => {
  if (props.visita) {
    form.value.propiedadId = props.visita.propiedadId;
    form.value.fecha = props.visita.fecha;
    form.value.hora = props.visita.hora;
  }
});

const handleSubmit = () => {
  // Validamos que haya una propiedad seleccionada
  if (!form.value.propiedadId) {
    alert("Por favor seleccione una propiedad.");
    return;
  }

  emit("actualizar", {
    id: props.visita?.id,
    leadId: props.lead?.id,
    ...form.value,
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
    <div
      class="bg-blanco-primario rounded-[24px] p-8 shadow-2xl w-full max-w-[450px] pointer-events-auto font-sans relative border border-gray-100 flex flex-col"
    >
      <button
        class="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-2xl font-bold text-black mb-6">Editar Visita</h2>

      <div class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-black mb-2 ml-1">Propiedad a Visitar</label>
          <div class="relative">
            <select
              v-model="form.propiedadId"
              class="w-full appearance-none bg-[#E0E0E0] rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer shadow-inner"
            >
              <option value="" disabled>Seleccionar...</option>
              <option v-for="prop in listaPropiedades" :key="prop.id" :value="prop.id">
                {{ prop.nombre }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
          <p class="text-[11px] text-gray-400 mt-1.5 ml-1 font-medium">
            Cambie la propiedad si es necesario
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-black mb-2 ml-1">Fecha de la Visita</label>
          <div class="relative">
            <input
              v-model="form.fecha"
              type="date"
              class="w-full bg-[#E0E0E0] rounded-xl py-3 px-4 text-sm font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
            />
          </div>
          <p class="text-[11px] text-gray-400 mt-1.5 ml-1 font-medium">
            Seleccione la fecha de la visita
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-black mb-2 ml-1">Hora de la Visita</label>
          <div class="relative">
            <input
              v-model="form.hora"
              type="time"
              class="w-full bg-[#E0E0E0] rounded-xl py-3 px-4 text-sm font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
            />
          </div>
          <p class="text-[11px] text-gray-400 mt-1.5 ml-1 font-medium">
            Hora local en formato de 24 horas
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-8 pt-2">
        <button
          @click="$emit('close')"
          class="px-6 py-2.5 border border-gray-400 rounded-xl text-xs font-bold text-black bg-white hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          @click="handleSubmit"
          class="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
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
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo para ajustar los inputs de fecha/hora */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  filter: invert(0);
}
</style>
