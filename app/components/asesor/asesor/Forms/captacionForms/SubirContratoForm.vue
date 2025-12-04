<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["close"]);

// Estado del formulario
const nombre = ref("");
const archivo = ref<File | null>(null);
const mensaje = ref("");
const colorMensaje = ref<"red" | "green" | "black">("black");

// Cerrar modal
const cerrar = () => {
  emit("close");
  mensaje.value = "";
  nombre.value = "";
  archivo.value = null;
};

// Submit — subir contrato
const subirContrato = async () => {
  if (!archivo.value) {
    mensaje.value = "Debe seleccionar un archivo.";
    colorMensaje.value = "red";
    return;
  }

  mensaje.value = "Subiendo...";
  colorMensaje.value = "black";

  const formData = new FormData();
  formData.append("nombre", nombre.value);
  formData.append("archivo", archivo.value);

  const { data, error } = await useFetch("/api/subir-contrato", {
    method: "POST",
    body: formData,
  });

  if (error.value) {
    mensaje.value = "Hubo un error al subir el contrato.";
    colorMensaje.value = "red";
    return;
  }

  mensaje.value = "¡Contrato subido correctamente!";
  colorMensaje.value = "green";

  setTimeout(() => cerrar(), 1500);
};
</script>

<template>
  <!-- Fondo difuminado -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="cerrar"></div>

  <!-- Contenedor principal -->
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
    <div
      class="bg-white rounded-[28px] shadow-2xl p-10 w-[600px] border border-gray-200 pointer-events-auto relative"
    >
      <!-- Botón cerrar -->
      <button
        class="absolute top-6 right-6 text-gray-500 hover:text-black transition p-1 rounded-full hover:bg-gray-100"
        @click="cerrar"
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

      <!-- Título -->
      <h2 class="text-2xl font-bold">Subir Contrato</h2>
      <p class="text-gray-400 text-sm mt-1 mb-6">Complete los datos y seleccione un archivo</p>

      <!-- FORMULARIO -->
      <form @submit.prevent="subirContrato" class="space-y-6">
        <!-- Nombre del contrato -->
        <div>
          <label class="block text-xs text-gray-500 font-bold mb-2 pl-1">Nombre del contrato</label>
          <input
            type="text"
            v-model="nombre"
            required
            class="w-full bg-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 shadow-inner"
            placeholder="Ejemplo: Contrato de renta"
          />
        </div>

        <!-- Archivo -->
        <div>
          <label class="block text-xs text-gray-500 font-bold mb-2 pl-1"
            >Archivo (PDF, DOC, DOCX)</label
          >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            required
            @change="(e) => (archivo = e.target.files[0])"
            class="w-full bg-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 shadow-inner"
          />
        </div>

        <!-- Mensaje de éxito o error -->
        <p
          v-if="mensaje"
          class="text-sm font-semibold"
          :class="{
            'text-red-500': colorMensaje === 'red',
            'text-green-600': colorMensaje === 'green',
            'text-black': colorMensaje === 'black',
          }"
        >
          {{ mensaje }}
        </p>

        <!-- Botón guardar -->
        <button
          type="submit"
          class="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition"
        >
          Guardar Contrato
        </button>
      </form>
    </div>
  </div>
</template>
