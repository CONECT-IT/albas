<script setup lang="ts">
import { ref, computed } from "vue";

const emit = defineEmits(["close"]);

// --- MOCK DATA: PROPIEDADES ---
const propiedades = [
  { id: 1, nombre: "Vista Hermosa" },
  { id: 2, nombre: "Residencial Los Álamos" },
  { id: 3, nombre: "Edificio Sky View" },
];

// --- MOCK DATA: GASTOS ---
const gastos = [
  {
    id: 1,
    propId: 1,
    fecha: "2025-11-09",
    nombrePropiedad: "Terreno Vista Hermosa",
    concepto: "Visita de Propiedad",
    categoria: "Transporte",
    nota: "Se hizo una visita con el cliente para verificar linderos.",
    monto: 1500,
  },
  {
    id: 2,
    propId: 1,
    fecha: "2025-11-15",
    nombrePropiedad: "Terreno Vista Hermosa",
    concepto: "Limpieza de Terreno",
    categoria: "Mantenimiento",
    nota: "Deshierbe y limpieza general del lote.",
    monto: 350,
  },
  {
    id: 3,
    propId: 2,
    fecha: "2025-12-01",
    nombrePropiedad: "Casa Los Álamos",
    concepto: "Pago de Servicios",
    categoria: "Utilidades",
    nota: "Pago de luz y agua.",
    monto: 800,
  },
];

// --- ESTADO ---
const propiedadSeleccionadaId = ref(1);

// --- FILTRO ---
const gastosFiltrados = computed(() => {
  return gastos.filter((g) => g.propId === propiedadSeleccionadaId.value);
});

// --- TOTAL ---
const totalMonto = computed(() => {
  return gastosFiltrados.value.reduce((acc, item) => acc + item.monto, 0);
});

// Formateadores
const formatoMoneda = (monto: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(monto);
};
</script>

<template>
  <!-- FONDO OSCURO -->
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
    @click="$emit('close')"
  ></div>

  <!-- CONTENEDOR DEL MODAL -->
  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
    <div
      class="bg-white rounded-[30px] shadow-2xl w-full max-w-[900px] pointer-events-auto relative border border-gray-200 flex flex-col max-h-[90vh]"
    >
      <!-- CABECERA -->
      <div class="p-8 pb-2">
        <button
          @click="$emit('close')"
          class="absolute top-6 right-6 text-black hover:text-gray-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-2xl font-bold text-black mb-1">Gastos de la Propiedad</h2>

        <!-- SELECTOR DE PROPIEDAD -->
        <div class="mt-4">
          <label class="block text-xs text-gray-400 font-medium mb-2 pl-1">
            Seleccione una propiedad
          </label>

          <div class="relative">
            <select
              v-model="propiedadSeleccionadaId"
              class="w-full appearance-none bg-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option v-for="prop in propiedades" :key="prop.id" :value="prop.id">
                {{ prop.nombre }}
              </option>
            </select>

            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENIDO SCROLLEABLE -->
      <div class="p-8 pt-4 overflow-y-auto space-y-8">
        <!-- SIN GASTOS -->
        <div v-if="gastosFiltrados.length === 0" class="text-center py-10 text-gray-400">
          No hay gastos registrados para esta propiedad.
        </div>

        <!-- TABLA DE GASTOS -->
        <div
          v-if="gastosFiltrados.length > 0"
          class="overflow-x-auto rounded-2xl border border-gray-300 shadow-md"
        >
          <table class="w-full border-collapse">
            <thead class="bg-black text-white text-sm font-semibold">
              <tr>
                <th class="py-4 px-6 text-left">Categoría</th>
                <th class="py-4 px-6 text-left">Concepto</th>
                <th class="py-4 px-6 text-left">Monto</th>
                <th class="py-4 px-6 text-left">Fecha</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="gasto in gastosFiltrados" :key="gasto.id" class="border-b border-gray-200">
                <td class="py-4 px-6">
                  <span class="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg">
                    {{ gasto.categoria }}
                  </span>
                </td>

                <td class="py-4 px-6 text-gray-700 font-medium">
                  {{ gasto.concepto }}
                </td>

                <td class="py-4 px-6 text-black font-bold">
                  {{ formatoMoneda(gasto.monto) }}
                </td>

                <td class="py-4 px-6 text-gray-600">
                  {{ gasto.fecha }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TOTAL -->
        <div class="mt-6">
          <h3 class="text-xl font-medium text-black mb-3 ml-1">Información Financiera Total</h3>
          <div class="rounded-[25px] border border-gray-400 bg-white p-6 shadow">
            <span class="block text-xs font-bold text-gray-400 mb-2">Monto Total</span>
            <span class="block text-4xl font-bold text-black tracking-tight">
              {{ formatoMoneda(totalMonto) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
