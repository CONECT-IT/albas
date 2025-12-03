<script setup>
import { ref } from "vue";

const emit = defineEmits(["close", "guardar"]);

// Lista de propiedades (datos de ejemplo)
const propiedades = ref([
  "Vista Hermosa",
  "Las Gardenias",
  "Mirador del Sol",
  "Residencial Los Pinos",
  "Valle Verde",
]);

const propiedadSeleccionada = ref("");
const comentario = ref("");

const guardarObservacion = () => {
  emit("guardar", {
    propiedad: propiedadSeleccionada.value,
    comentario: comentario.value,
  });
};
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40">
    <div class="bg-blanco-primario rounded-2xl shadow-xl w-[750px] p-8 relative">

      <!-- Botón cerrar -->
      <button @click="emit('close')" class="absolute top-4 right-4 text-2xl">
        ✕
      </button>

      <!-- Título -->
      <h2 class="text-2xl font-semibold mb-1">Editar Observación</h2>
      <p class="text-sm text-gray-500 mb-4">Seleccione una propiedad</p>

      <!-- Selector normal de propiedades -->
      <select
        v-model="propiedadSeleccionada"
        class="w-full bg-gray-200 px-4 py-2 rounded-lg mb-5 outline-none cursor-pointer"
      >
        <option disabled value="">Seleccione una propiedad</option>
        <option v-for="(prop, index) in propiedades" :key="index">
          {{ prop }}
        </option>
      </select>

      <!-- Textarea -->
      <textarea
        v-model="comentario"
        placeholder="Escriba su comentario..."
        class="w-full h-40 border px-4 py-3 rounded-xl resize-none mb-6"
      ></textarea>

      <!-- Botones -->
      <div class="flex justify-end space-x-4">

        <button
          @click="emit('close')"
          class="px-6 py-2 rounded-lg border"
        >
          Cancelar
        </button>

        <button
          @click="guardarObservacion"
          class="px-6 py-2 rounded-lg bg-negro-primario text-blanco-primario flex items-center gap-2"
        >
          <span>
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
          </span>
          Guardar Cambios
        </button>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* Scroll */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 10px;
}
</style>
