<template>
  <div class="bg-white mx-auto px-4 sm:px-6 h-fit lg:px-8 py-8 border border-gray-200 rounded-3xl">
    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  requiredRoles: ["Administrador"],
  layout: "admin",
});
</script>
