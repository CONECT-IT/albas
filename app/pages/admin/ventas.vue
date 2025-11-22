<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Ventas</h1>
    <div class="bg-white rounded-lg shadow-md p-6">
      <p class="text-gray-600">Aquí se mostrará la información de las ventas.</p>
      <!-- Contenido específico para la gestión de ventas -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});
</script>
