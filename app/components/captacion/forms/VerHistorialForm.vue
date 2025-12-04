<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Cita {
  id_cita: number;
  fecha_agendada: string;
  estado_visita_guiada: string;
  observacion: string | null;
}

interface Conversion {
  id_conversion: number;
  fecha_conversion: string;
  tipo_anterior: string;
  tipo_nuevo: string;
}

interface ClienteAPI {
  id_persona: number;
  nombre: string;
  celular: string | null;
  id_propiedad?: number | null;
  direccion?: string | null;
}

const props = defineProps<{
  cliente?: ClienteAPI;
}>();

const emit = defineEmits<{
  close: [];
}>();

const loading = ref(true);
const citas = ref<Cita[]>([]);
const conversiones = ref<Conversion[]>([]);

// Cargar historial al montar
onMounted(async () => {
  if (!props.cliente?.id_persona) return;
  
  try {
    const { data } = await $fetch<{ data: { citas: Cita[]; conversiones: Conversion[] } }>(
      `/api/asesor/captacion/clientes/historial?id_persona=${props.cliente.id_persona}`
    );
    citas.value = data.citas || [];
    conversiones.value = data.conversiones || [];
  } catch (error) {
    console.error("Error al cargar historial:", error);
  } finally {
    loading.value = false;
  }
});

const totalCitas = computed(() => citas.value.length);

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatFechaCorta = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-PE");
};
</script>

<template>
  <UiBaseModal
    :show="true"
    title="Historial del Cliente"
    :subtitle="cliente?.nombre"
    size="xl"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8 text-gray-500">
        Cargando historial...
      </div>

      <template v-else>
        <!-- Resumen -->
        <div class="rounded-xl overflow-hidden border border-gray-200">
          <div class="bg-black text-white px-6 py-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
            <span class="font-medium text-sm">Resumen</span>
          </div>
          <div class="bg-gradient-to-b from-gray-100 to-white p-6 flex gap-6">
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 py-6 flex flex-col items-center justify-center gap-2"
            >
              <UiIconClock class="w-6 h-6 text-black" />
              <span class="text-2xl font-bold text-black">{{ totalCitas }}</span>
              <span class="text-xs font-medium text-black">Citas</span>
            </div>
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 py-6 flex flex-col items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-black"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              <span class="text-2xl font-bold text-black">{{ conversiones.length }}</span>
              <span class="text-xs font-medium text-black">Conversiones</span>
            </div>
          </div>
        </div>

        <!-- Historial de Conversiones -->
      <div class="rounded-xl overflow-hidden border border-gray-200">
        <div class="bg-black text-white px-6 py-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
          </svg>
          <span class="font-medium text-sm">Historial de Conversiones</span>
        </div>
        <div class="bg-gradient-to-b from-gray-50 to-white p-4">
          <div v-if="conversiones.length === 0" class="text-center text-gray-400 py-4 text-sm">
            Sin conversiones registradas
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="conv in conversiones"
              :key="conv.id_conversion"
              class="flex items-center gap-4 px-4 py-3 bg-white rounded-lg border border-gray-100"
            >
              <span class="text-xs text-gray-500">{{
                formatFechaCorta(conv.fecha_conversion)
              }}</span>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded text-xs bg-gray-100">{{
                  conv.tipo_anterior || "-"
                }}</span>
                <span class="text-gray-400">→</span>
                <span class="px-2 py-1 rounded text-xs bg-green-100 text-green-700">{{
                  conv.tipo_nuevo
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Citas -->
      <div class="rounded-xl overflow-hidden border border-gray-200">
        <div class="bg-black text-white px-6 py-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span class="font-medium text-sm">Citas Programadas</span>
        </div>
        <div class="bg-gradient-to-b from-gray-50 to-white p-4">
          <div v-if="citas.length === 0" class="text-center text-gray-400 py-4 text-sm">
            Sin citas registradas
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="cita in citas"
              :key="cita.id_cita"
              class="grid grid-cols-3 gap-4 px-4 py-3 bg-white rounded-lg border border-gray-100"
            >
              <span class="text-sm font-medium">{{ formatFecha(cita.fecha_agendada) }}</span>
              <span class="text-sm">{{ cita.estado_visita_guiada }}</span>
              <span class="text-sm text-gray-500 truncate">{{ cita.observacion || "-" }}</span>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>

    <template #footer>
      <UiBaseButton variant="secondary" @click="emit('close')"> Cerrar </UiBaseButton>
    </template>
  </UiBaseModal>
</template>
