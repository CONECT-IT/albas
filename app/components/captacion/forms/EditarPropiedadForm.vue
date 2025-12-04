<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  lead?: any;
  propiedad?: any;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const personaId = computed(() => props.lead?.id_persona || props.propiedad?.id_persona);

// Cargar propiedades del lead
const { data: propiedadesData, pending } = useLazyFetch("/api/asesor/captacion/propiedades", {
  query: { id_persona: personaId },
  default: () => ({ data: [] }),
  watch: [personaId],
});

const propiedades = computed(() => propiedadesData.value?.data || []);
const propiedadSeleccionada = ref<any>(null);
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

const seleccionarPropiedad = (prop: any) => {
  propiedadSeleccionada.value = prop;
  form.value = {
    direccion: prop.direccion || "",
    precio_negociable: prop.precio_negociable || 0,
    medidas: prop.medidas || "",
    servicios_basicos: prop.servicios_basicos || "",
    partida_registral: prop.partida_registral || "",
    descripcion: prop.descripcion || "",
  };
};

const handleSubmit = async () => {
  if (!propiedadSeleccionada.value || !form.value.direccion) {
    error.value = "Selecciona una propiedad y completa la dirección";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await $fetch("/api/asesor/captacion/propiedades", {
      method: "PUT",
      body: {
        id_propiedad: propiedadSeleccionada.value.id_propiedad,
        ...form.value,
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
    title="Editar Propiedad"
    subtitle="Selecciona y modifica una propiedad"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="pending" class="py-8 text-center text-gray-500">Cargando propiedades...</div>

    <div v-else-if="propiedades.length === 0" class="py-8 text-center text-gray-500">
      No hay propiedades para editar
    </div>

    <div v-else class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Lista de propiedades para seleccionar -->
      <div v-if="!propiedadSeleccionada" class="space-y-2">
        <p class="text-sm text-gray-600 mb-2">Selecciona una propiedad:</p>
        <button
          v-for="prop in propiedades"
          :key="prop.id_propiedad"
          @click="seleccionarPropiedad(prop)"
          class="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p class="font-medium">{{ prop.direccion }}</p>
          <p class="text-sm text-gray-500">${{ prop.precio_negociable?.toLocaleString() }}</p>
        </button>
      </div>

      <!-- Formulario de edición -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-500">Editando: {{ propiedadSeleccionada.direccion }}</span>
          <button
            type="button"
            @click="propiedadSeleccionada = null"
            class="text-sm text-blue-600 hover:underline"
          >
            Cambiar
          </button>
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
      </form>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')" :disabled="loading">
        Cancelar
      </UiBaseButton>
      <UiBaseButton v-if="propiedadSeleccionada" @click="handleSubmit" :disabled="loading">
        {{ loading ? "Guardando..." : "Guardar Cambios" }}
      </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
