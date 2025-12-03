<script setup lang="ts">
import { ref } from "vue";
const show = ref(false);
// guarda la acción a ejecutar
let accionAConfirmar: Function | null = null;
// Función llamada desde el padre
const confirmar = (accion: Function) => {
  accionAConfirmar = accion;
  show.value = true;
};
// Confirmar
const aceptar = () => {
  if (accionAConfirmar) accionAConfirmar();
  cerrar();
};
// Cancelar
const cerrar = () => {
  show.value = false;
  accionAConfirmar = null;
};
// Exponer función al padre
defineExpose({
  confirmar,
});
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50">
    <!--DESENFOQUE-->
    <div
      class="absolute inset-0 bg-negro-primario/40 backdrop-blur-md transition duration-200 z-40"
      @click="cerrar"
    ></div>
    <!--MODAL -->
    <div
      class="relative z-50 bg-blanco-primario rounded-xl p-6 w-80 mx-auto mt-40 text-center shadow-xl"
    >
      <h2 class="text-lg font-bold mb-2">¿Estás seguro?</h2>
      <p class="text-sm mb-6">¿Deseas guardar esta información?</p>

      <div class="flex justify-between">
        <button
          @click="cerrar"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>

        <button
          @click="aceptar"
          class="px-4 py-2 bg-negro-primario text-white rounded-lg hover:bg-black"
        >
          Sí, guardar
        </button>
      </div>
    </div>

  </div>
</template>
