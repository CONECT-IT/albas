<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  lead?: any;
  cita?: any;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const loading = ref(false);
const error = ref("");
const comentario = ref("");

onMounted(() => {
  // Cargar observación existente
  if (props.lead?.observacion) {
    comentario.value = props.lead.observacion;
  }
});

const guardarObservacion = async () => {
  if (!comentario.value.trim()) {
    error.value = "Escriba una observación";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await $fetch("/api/asesor/captacion/leads", {
      method: "PUT",
      body: {
        id_persona: props.lead?.id_persona,
        observacion: comentario.value,
      },
    });
    emit("saved");
    emit("close");
  } catch (e: any) {
    error.value = e.data?.message || "Error al guardar";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiBaseModal :show="true" title="Agregar Observación" size="md" @close="emit('close')">
    <div class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Comentario</label>
        <textarea
          v-model="comentario"
          placeholder="Escriba su observación..."
          class="w-full h-40 border border-gray-300 px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-black"
        />
      </div>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')" :disabled="loading">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="guardarObservacion" :disabled="loading">
        {{ loading ? "Guardando..." : "Guardar" }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
