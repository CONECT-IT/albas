<script setup lang="ts">
defineEmits<{
  add: [];
  edit: [];
  view: [];
}>();
</script>

<template>
  <div class="flex items-center gap-1">
    <UiActionButton variant="add" title="Agregar" @click="$emit('add')" />
    <UiActionButton variant="edit" title="Editar" @click="$emit('edit')" />
    <UiActionButton variant="view" title="Ver" @click="$emit('view')" />
  </div>
</template>
