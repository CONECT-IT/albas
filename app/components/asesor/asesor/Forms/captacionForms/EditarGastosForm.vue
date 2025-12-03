<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

// Tipos
interface Gasto {
  id: number | string;
  categoria: string;
  concepto: string;
  monto: string;
  fecha: string;
}

interface Propiedad {
  id: number | string;
  nombre: string;
}

const props = defineProps<{
  propiedadInicial?: Propiedad | null;
  gastosIniciales?: Gasto[];
  propiedadesDisponibles?: Propiedad[];
}>();

const emit = defineEmits(["close", "guardar"]); 

// --- ESTADO ---
const propiedadSeleccionadaId = ref<number | string>(props.propiedadInicial?.id || "");
const gastoEditandoId = ref<number | string | null>(null);

const form = ref({
  concepto: "",
  monto: "",
  categoria: "",
  fecha: new Date().toISOString().split('T')[0],
});

const listaGastos = ref<Gasto[]>([]);

const listaPropiedades = computed(() => props.propiedadesDisponibles || [
  { id: 1, nombre: 'Vista Hermosa' },
  { id: 2, nombre: 'Lote Centro' }
]);

// Inicializar
watchEffect(() => {
  if (props.gastosIniciales && props.gastosIniciales.length > 0) {
    listaGastos.value = props.gastosIniciales.map(g => ({
      ...g,
      monto: Number(g.monto).toFixed(2),
    }));
  } else {
    listaGastos.value = [
      { id: 1, categoria: 'Transporte', concepto: 'Visita de propiedad', monto: '40.00', fecha: '2025-11-16' },
      { id: 2, categoria: 'Transporte', concepto: 'Visita de propiedad', monto: '40.00', fecha: '2025-11-16' },
      { id: 3, categoria: 'Transporte', concepto: 'Visita de propiedad', monto: '40.00', fecha: '2025-11-16' }
    ];
  }

  if (props.propiedadInicial) {
    propiedadSeleccionadaId.value = props.propiedadInicial.id;
  }
});

// --- FUNCIONES ---
const cargarGastoParaEditar = (gasto: Gasto) => {
  gastoEditandoId.value = gasto.id;
  form.value.concepto = gasto.concepto;
  form.value.monto = gasto.monto;
  form.value.categoria = gasto.categoria;
  form.value.fecha = gasto.fecha;
};

const agregarOActualizarGasto = () => {
  if (!form.value.concepto || !form.value.monto) {
    alert("Falta concepto o monto");
    return;
  }

  const gastoData: Gasto = {
    id: gastoEditandoId.value || Date.now() + Math.random(),
    categoria: form.value.categoria || 'General',
    concepto: form.value.concepto,
    monto: Number(form.value.monto).toFixed(2),
    fecha: form.value.fecha,
  };

  if (gastoEditandoId.value) {
    const i = listaGastos.value.findIndex(g => g.id === gastoEditandoId.value);
    if (i !== -1) listaGastos.value[i] = gastoData;
    gastoEditandoId.value = null;
  } else {
    listaGastos.value.unshift(gastoData);
  }

  limpiarFormulario();
};

const limpiarFormulario = () => {
  form.value.concepto = "";
  form.value.monto = "";
  form.value.categoria = "";
  form.value.fecha = new Date().toISOString().split('T')[0];
  gastoEditandoId.value = null;
};

const eliminarGasto = (id: number | string) => {
  listaGastos.value = listaGastos.value.filter(g => g.id !== id);
  if (gastoEditandoId.value === id) limpiarFormulario();
};

const guardarCambios = () => {
  if (!propiedadSeleccionadaId.value) {
    alert("Seleccione una propiedad.");
    return;
  }

  emit("guardar", {
    propiedadId: propiedadSeleccionadaId.value,
    gastos: listaGastos.value
  });

  emit("close");
}; 

const tituloFormulario = computed(() =>
  gastoEditandoId.value ? "Editando Categoría" : "Agregar Nueva Categoría"
);
</script>

<!-- Parte Visual -->
<template>
  <!-- Fondo -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="$emit('close')"></div>
  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
    <div class="bg-blanco-primario rounded-[24px] w-full max-w-[900px] max-h-[90vh] shadow-2xl border border-gray-100 flex flex-col pointer-events-auto overflow-hidden">

      <!-- HEADER -->
      <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900">Editar Gastos</h2>
          <p class="text-xs text-gray-500 mt-1">Edite la información de gastos</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
          </svg>
        </button>
      </div>

      <!-- BODY -->
      <div class="overflow-y-auto p-8 custom-scrollbar flex-grow">

        <!-- Select propiedad -->
        <div class="mb-8">
          <label class="block text-xs font-bold mb-2 ml-1">Seleccione una propiedad</label>
          <select v-model="propiedadSeleccionadaId" class="w-full max-w-sm bg-[#E0E0E0] rounded-xl py-3 px-4 text-sm font-bold shadow-inner">
            <option value="" disabled>Seleccionar...</option>
            <option v-for="p in listaPropiedades" :key="p.id" :value="p.id">{{ p.nombre }}</option>
          </select>
        </div>

        <!-- FORM -->
        <div class="border border-gray-300 rounded-[24px] p-6 mb-8 bg-white shadow-sm">
          <h3 class="text-sm font-bold mb-5 flex items-center gap-2">
            <span class="w-2 h-2 bg-black rounded-full"></span>
            {{ tituloFormulario }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold mb-1 ml-1">Concepto</label>
                <input v-model="form.concepto" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 px-4 shadow-inner">
              </div>
              <div>
                <label class="block text-xs font-bold mb-1 ml-1">Monto</label>
                <input v-model="form.monto" type="number" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 px-4 shadow-inner">
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold mb-1 ml-1">Categoría</label>
                <input v-model="form.categoria" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 px-4 shadow-inner">
              </div>

              <div>
                <label class="block text-xs font-bold mb-1 ml-1">Fecha</label>
                <input v-model="form.fecha" type="date" class="w-full bg-[#E0E0E0] rounded-xl py-2.5 px-4 shadow-inner">
              </div>

              <div class="pt-4 flex justify-end">
                <button @click="agregarOActualizarGasto"
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center text-blanco-primario shadow-lg transition active:scale-95',
                    gastoEditandoId ? 'bg-blue-600' : 'bg-black'
                  ]">
                  <span v-if="!gastoEditandoId">＋</span>
                  <span v-else>✔</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- TABLA -->
        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-blanco-primario">
          <div class="grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] bg-black text-blanco-primario px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-center">
            <span class="text-left pl-2">Categoría</span>
            <span class="text-left">Concepto</span>
            <span class="text-left">Monto</span>
            <span>Fecha</span>
            <span class="text-right pr-2">Acción</span>
          </div>

          <div class="divide-y divide-gray-100 bg-blanco-primario min-h-[100px]">

            <div v-if="listaGastos.length === 0" class="py-8 text-center text-gray-400 text-sm italic">
              No hay gastos agregados.
            </div>

            <div 
              v-for="gasto in listaGastos"
              :key="gasto.id"
              class="grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] px-4 py-3.5 items-center border-b last:border-0 transition"
              :class="{ 'bg-blue-50': gastoEditandoId === gasto.id }"
            >
              <span class="text-left font-bold text-gray-800 pl-2 text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                {{ gasto.categoria }}
              </span>

              <span class="text-left font-medium text-gray-600 text-sm truncate">
                {{ gasto.concepto }}
              </span>

              <span class="text-left font-extrabold text-negro-primario text-sm">
                $ {{ gasto.monto }}
              </span>

              <span class="text-xs text-gray-500">{{ gasto.fecha }}</span>

              <div class="flex justify-end pr-2 gap-2">
                <button @click="cargarGastoParaEditar(gasto)" class="text-gray-400 hover:text-blue-600">
                  ✎
                </button>

                <button @click="eliminarGasto(gasto.id)" class="text-gray-400 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 
                        2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 
                        0 0 1-2.244-2.077L4.772 5.79m14.456 
                        0a48.108 48.108 0 0 0-3.478-.397m-12 
                        .562c.34-.059.68-.114 1.022-.165m0 0a48.11 
                        48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                        51.964 0 0 0-3.32 0c-1.18.037-2.09 
                        1.022-2.09 2.201v.916m7.5 0a48.667 
                        48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="bg-gray-50 px-8 py-4 border-t flex justify-end gap-3">
        <button @click="$emit('close')" class="px-6 py-2 border rounded-xl">
          Cancelar
        </button>
        <button @click="guardarCambios" class="px-8 py-2 bg-negro-primario text-blanco-primario rounded-xl">
          Guardar Cambios
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
