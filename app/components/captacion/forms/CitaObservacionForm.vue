<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  cita?: any;
  mode?: "add" | "edit";
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const loading = ref(false);
const error = ref("");
const observacion = ref("");

onMounted(() => {
  if (props.cita?.observacion) {
    observacion.value = props.cita.observacion;
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    await $fetch("/api/asesor/citas", {
      method: "PUT",
      body: {
        id_cita: props.cita?.id_cita,
        observacion: observacion.value,
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
  <UiBaseModal
    :show="true"
    :title="mode === 'edit' ? 'Editar Observación' : 'Agregar Observación'"
    size="md"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Observación de la cita</label>
        <textarea
          v-model="observacion"
          placeholder="Escriba observaciones sobre esta visita..."
          class="w-full h-40 border border-gray-300 px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-black"
        />
      </div>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')" :disabled="loading">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="handleSubmit" :disabled="loading">
        {{ loading ? "Guardando..." : "Guardar" }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
