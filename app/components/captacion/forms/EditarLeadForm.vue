<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { LeadVendedor, TipoPersona } from "~~/shared/types";
import { TIPOS_PERSONA, toSelectOptions } from "~/composables/useEstados";

const props = defineProps<{
  lead?: LeadVendedor;
  cita?: any;
  cliente?: any;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const item = computed(() => props.lead || props.cita || props.cliente);

const loading = ref(false);
const error = ref("");

const form = ref({
  nombre: "",
  celular: "",
  tipo: "" as TipoPersona | "",
});

const tipoOptions = toSelectOptions(TIPOS_PERSONA);

onMounted(() => {
  if (item.value) {
    form.value = {
      nombre: item.value.nombre || item.value.persona_nombre || "",
      celular: item.value.celular || "",
      tipo: item.value.tipo || "",
    };
  }
});

const handleSubmit = async () => {
  if (!form.value.nombre) {
    error.value = "El nombre es requerido";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const id = item.value?.id_persona || item.value?.id_persona;
    await $fetch("/api/asesor/captacion/leads", {
      method: "PUT",
      body: {
        id_persona: id,
        nombre: form.value.nombre,
        celular: form.value.celular || null,
        tipo: form.value.tipo || null,
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
    title="Editar Lead"
    subtitle="Modifica la información del lead"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <UiBaseInput
        v-model="form.nombre"
        label="Nombre Completo"
        placeholder="Ingrese nombre"
        required
      />

      <UiBaseInput
        v-model="form.celular"
        label="Número de Celular"
        placeholder="900000000"
        type="tel"
      />

      <UiBaseSelect
        v-model="form.tipo"
        label="Tipo"
        :options="tipoOptions"
        placeholder="Seleccione tipo"
      />
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
