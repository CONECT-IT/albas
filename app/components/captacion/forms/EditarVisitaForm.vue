<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  lead?: any;
  cita?: any;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const personaId = computed(() => props.lead?.id_persona || props.cita?.id_persona);

// Cargar citas de esta persona
const {
  data: citasData,
  pending,
  refresh,
} = useLazyFetch("/api/asesor/citas", {
  default: () => ({ data: [] }),
});

const citasPersona = computed(() => {
  const all = citasData.value?.data || [];
  if (!personaId.value) return all;
  return all.filter((c: any) => c.id_persona === personaId.value);
});

const citaSeleccionada = ref<any>(null);
const loading = ref(false);
const error = ref("");

const form = ref({
  fecha: "",
  hora: "",
  observacion: "",
});

const seleccionarCita = (cita: any) => {
  citaSeleccionada.value = cita;
  const fecha = new Date(cita.fecha_agendada);
  form.value = {
    fecha: fecha.toISOString().split("T")[0],
    hora: fecha.toTimeString().slice(0, 5),
    observacion: cita.observacion || "",
  };
};

const handleSubmit = async () => {
  if (!citaSeleccionada.value || !form.value.fecha) {
    error.value = "Selecciona una cita y completa la fecha";
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
        id_cita: citaSeleccionada.value.id_cita,
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
    title="Editar Visita"
    subtitle="Reprogramar o modificar una visita"
    size="md"
    @close="emit('close')"
  >
    <div v-if="pending" class="py-8 text-center text-gray-500">Cargando visitas...</div>

    <div v-else-if="citasPersona.length === 0" class="py-8 text-center text-gray-500">
      No hay visitas para editar
    </div>

    <div v-else class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Lista de citas para seleccionar -->
      <div v-if="!citaSeleccionada" class="space-y-2">
        <p class="text-sm text-gray-600 mb-2">Selecciona una visita:</p>
        <button
          v-for="cita in citasPersona"
          :key="cita.id_cita"
          @click="seleccionarCita(cita)"
          class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p class="font-medium">{{ new Date(cita.fecha_agendada).toLocaleDateString("es-PE") }}</p>
          <p class="text-sm text-gray-500">{{ cita.estado_visita_guiada }}</p>
        </button>
      </div>

      <!-- Formulario de edición -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-500">Editando visita</span>
          <button
            type="button"
            @click="citaSeleccionada = null"
            class="text-sm text-blue-600 hover:underline"
          >
            Cambiar
          </button>
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
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')" :disabled="loading">
        Cancelar
      </UiBaseButton>
      <UiBaseButton v-if="citaSeleccionada" @click="handleSubmit" :disabled="loading">
        {{ loading ? "Guardando..." : "Guardar Cambios" }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
