<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  requiredRoles: ["Asesor"],
  layout: "asesor",
});
</script>
