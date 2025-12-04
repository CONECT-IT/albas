<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  cita?: any;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const loading = ref(false);
const error = ref("");

const form = ref({
  fecha: "",
  hora: "",
  observacion: "",
});

onMounted(() => {
  if (props.cita) {
    const fecha = new Date(props.cita.fecha_agendada);
    form.value = {
      fecha: fecha.toISOString().split("T")[0],
      hora: fecha.toTimeString().slice(0, 5),
      observacion: props.cita.observacion || "",
    };
  }
});

const handleSubmit = async () => {
  if (!form.value.fecha) {
    error.value = "La fecha es requerida";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    let fechaAgendada = form.value.fecha;
    if (form.value.hora) {
      fechaAgendada = `${form.value.fecha}T${form.value.hora}`;
    }

    await $fetch("/api/asesor/citas", {
      method: "PUT",
      body: {
        id_cita: props.cita?.id_cita,
        fecha_agendada: fechaAgendada,
        observacion: form.value.observacion || null,
      },
    });
    emit("updated");
    emit("close");
  } catch (e: any) {
    error.value = e.data?.message || "Error al actualizar";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Editar Cita"
    subtitle="Modificar fecha y observación de la visita"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <UiBaseInput v-model="form.fecha" label="Fecha de la Visita" type="date" required />

      <UiBaseInput v-model="form.hora" label="Hora de la Visita" type="time" />

      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Observación</label>
        <textarea
          v-model="form.observacion"
          placeholder="Notas adicionales..."
          class="w-full border border-gray-300 rounded-lg p-2.5 resize-none h-20"
        />
      </div>
    </form>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')" :disabled="loading">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="handleSubmit" :disabled="loading">
        {{ loading ? "Guardando..." : "Guardar Cambios" }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
