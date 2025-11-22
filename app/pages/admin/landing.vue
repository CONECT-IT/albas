<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Configuración del Landing</h1>
    <div class="bg-white rounded-lg shadow-md p-6">
      <p class="text-gray-600">Aquí se podrá configurar el contenido del landing page.</p>
      <!-- Contenido específico para la configuración del landing -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});
</script>
