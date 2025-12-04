<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  lead?: any;
  propiedad?: any;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
  updated: [];
}>();

const esEdicion = computed(() => !!props.propiedad);
const loading = ref(false);
const error = ref("");

const form = ref({
  direccion: "",
  precio_negociable: 0,
  medidas: "",
  servicios_basicos: "",
  partida_registral: "",
  descripcion: "",
});

onMounted(() => {
  if (props.propiedad) {
    form.value = {
      direccion: props.propiedad.direccion || "",
      precio_negociable: props.propiedad.precio_negociable || 0,
      medidas: props.propiedad.medidas || "",
      servicios_basicos: props.propiedad.servicios_basicos || "",
      partida_registral: props.propiedad.partida_registral || "",
      descripcion: props.propiedad.descripcion || "",
    };
  }
});

const handleSubmit = async () => {
  if (!form.value.direccion || !form.value.precio_negociable) {
    error.value = "Dirección y precio son requeridos";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    if (esEdicion.value) {
      await $fetch("/api/asesor/captacion/propiedades", {
        method: "PUT",
        body: {
          id_propiedad: props.propiedad.id_propiedad,
          ...form.value,
        },
      });
      emit("updated");
    } else {
      await $fetch("/api/asesor/captacion/propiedades", {
        method: "POST",
        body: {
          id_persona: props.lead?.id_persona,
          ...form.value,
        },
      });
      emit("created");
    }
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
    :title="esEdicion ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'"
    :subtitle="
      esEdicion
        ? 'Modifica los datos de la propiedad.'
        : 'Completa la información de la nueva propiedad.'
    "
    size="lg"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <UiBaseInput
        v-model="form.direccion"
        label="Dirección"
        placeholder="Ej: Av. Perú 123"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          v-model="form.precio_negociable"
          label="Precio ($)"
          type="number"
          placeholder="30000"
          required
        />
        <UiBaseInput v-model="form.medidas" label="Medidas" placeholder="Ej: 200 m2" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          v-model="form.servicios_basicos"
          label="Servicios Básicos"
          placeholder="Ej: Agua, luz"
        />
        <UiBaseInput
          v-model="form.partida_registral"
          label="Partida Registral"
          placeholder="Ej: PR-001"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-1">Descripción</label>
        <textarea
          v-model="form.descripcion"
          placeholder="Descripción de la propiedad..."
          class="w-full border border-gray-300 rounded-lg p-2.5 resize-none h-20"
        />
      </div>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')" :disabled="loading">
        Cancelar
      </UiBaseButton>
      <UiBaseButton @click="handleSubmit" :disabled="loading">
        {{ loading ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Crear Propiedad" }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
