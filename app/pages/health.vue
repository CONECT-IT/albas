<template>
    <div>{{ statusMessage }}</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const statusMessage = ref("");

onMounted(async () => {
    try {
        const res = await fetch("/api/health");
        const data = await res.json();
        if (res.ok) {
            statusMessage.value = data.message;
        } else {
            statusMessage.value = "Error al obtener el estado del servidor";
        }
    } catch (error) {
        statusMessage.value = "No se pudo conectar al servidor";
    }
});
</script>
