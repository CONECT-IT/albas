<script setup lang="ts">
import { ref, computed, onMounted } from "vue"; // Importación de utilidades reactivas

// Definición de props que llegan del padre
const props = defineProps<{
  lead?: any; // Información del lead
  propiedad?: any; // Propiedad seleccionada para editar
  propiedadesDisponibles?: any[]; // Lista de propiedades para el select
}>();

// Eventos que se enviarán al componente padre
const emit = defineEmits(["close", "actualizar"]);

// --- ESTADO ---
const propiedadSeleccionadaId = ref<number | string>(""); // ID de propiedad seleccionada

// Formulario principal
const form = ref({
  nombre: "",
  precio: "",
  ubicacion: "",
  tamano: "",
  documento: "", // Documento legal: partida/documento
});

// Estados para características dinámicas
const carNombre = ref(""); // Nombre de la característica
const carValor = ref(""); // Valor de la característica
const caracteristicas = ref<{ id: number; nombre: string; valor: string }[]>([]); // Lista de detalles
const idCaracteristicaEditando = ref<number | null>(null); // Para saber si se está editando una característica

// Lista computada para evitar fallos si no llegan props
const listaPropiedades = computed(() => props.propiedadesDisponibles || []);

// --- AL MONTAR ---
onMounted(() => {
  if (props.propiedad) {
    propiedadSeleccionadaId.value = props.propiedad.id; // Selecciona propiedad actual

    // Llena el formulario
    form.value = {
      nombre: props.propiedad.nombre,
      precio: props.propiedad.precio,
      ubicacion: props.propiedad.ubicacion,
      tamano: props.propiedad.tamano,
      documento: props.propiedad.documento || props.propiedad.partida, // Mapea documento
    };

    // Copia características si existen
    if (props.propiedad.detalles) {
      caracteristicas.value = props.propiedad.detalles.map((d: any) => ({ ...d }));
    }
  }
});

// Cuando el usuario cambia el select manualmente
const cargarDatosPropiedad = () => {
  const prop = listaPropiedades.value.find((p) => p.id === propiedadSeleccionadaId.value);
  if (prop) {
    form.value = {
      nombre: prop.nombre,
      precio: prop.precio,
      ubicacion: prop.ubicacion,
      tamano: prop.tamano,
      documento: prop.documento || prop.partida,
    };
    caracteristicas.value = prop.detalles ? prop.detalles.map((d: any) => ({ ...d })) : [];
  }
};

// Guardar o editar característica
const guardarCaracteristica = () => {
  if (carNombre.value.trim() && carValor.value.trim()) {
    // Si se está editando
    if (idCaracteristicaEditando.value !== null) {
      const index = caracteristicas.value.findIndex((c) => c.id === idCaracteristicaEditando.value);
      if (index !== -1) {
        caracteristicas.value[index].nombre = carNombre.value;
        caracteristicas.value[index].valor = carValor.value;
      }
      idCaracteristicaEditando.value = null;
    } else {
      // Si es una característica nueva
      caracteristicas.value.push({
        id: Date.now(), // Genera ID único
        nombre: carNombre.value,
        valor: carValor.value,
      });
    }

    // Limpia campos
    carNombre.value = "";
    carValor.value = "";
  }
};

// Cargar característica en modo edición
const editarCaracteristica = (item: any) => {
  carNombre.value = item.nombre;
  carValor.value = item.valor;
  idCaracteristicaEditando.value = item.id;
};

// Eliminar característica
const eliminarCaracteristica = (id: number) => {
  caracteristicas.value = caracteristicas.value.filter((c) => c.id !== id);

  if (idCaracteristicaEditando.value === id) {
    idCaracteristicaEditando.value = null;
    carNombre.value = "";
    carValor.value = "";
  }
};

// Guardar cambios finales
const guardarCambios = () => {
  if (!propiedadSeleccionadaId.value) {
    alert("Error: No hay propiedad seleccionada.");
    return;
  }

  // Emitir datos editados al padre
  emit("actualizar", {
    id: propiedadSeleccionadaId.value,
    leadId: props.propiedad?.leadId || props.lead?.id, // Mantener relación lead-propiedad
    ...form.value,
    detalles: caracteristicas.value,
  });

  emit("close"); // Cerrar modal
};
</script>

<template>
  <!-- Fondo oscuro -->
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" @click="$emit('close')"
  ></div>

  <!-- Contenedor del modal centrado -->
  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
    <div
      class="bg-blanco-primario rounded-[24px] p-8 shadow-2xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto pointer-events-auto font-sans relative flex flex-col border border-gray-100"
    >
      <!-- Botón cerrar -->
      <button
        class="absolute top-6 right-6 text-gray-800 hover:scale-110 transition-transform"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Título del modal -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-negro-primario">Editar Propiedad</h2>
        <p class="text-gray-400 text-sm mt-1">Edite la información de la propiedad</p>
      </div>

      <!-- Formulario -->
      <div class="space-y-4">
        <!-- Select de propiedades + nombre -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-gray-400 mb-1 ml-1"
              >Seleccione una propiedad</label
            >
            <div class="relative">
              <select
                v-model="propiedadSeleccionadaId"
                @change="cargarDatosPropiedad"
                class="w-full appearance-none bg-gray-200 border-none rounded-lg p-2.5 pr-8 text-sm font-bold text-gray-800 focus:ring-0 cursor-pointer"
              >
                <option value="" disabled>Seleccionar...</option>
                <option v-for="prop in listaPropiedades" :key="prop.id" :value="prop.id">
                  {{ prop.nombre }}
                </option>
              </select>

              <!-- Flecha del select -->
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                <svg
                  class="fill-current h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Nombre -->
          <div>
            <label class="block text-xs font-bold text-gray-800 mb-1 ml-1">Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              class="w-full border-2 border-gray-800 rounded-lg p-2.5 font-medium text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <!-- Precio + ubicación -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-800 mb-1 ml-1">Precio ($)</label>
            <div class="relative">
              <input
                v-model="form.precio"
                type="text"
                class="w-full border-2 border-gray-800 rounded-lg p-2.5 font-medium text-sm text-gray-900 bg-white focus:outline-none"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 font-bold text-sm pointer-events-none"
                >$</span
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-800 mb-1 ml-1">Ubicación</label>
            <input
              v-model="form.ubicacion"
              type="text"
              class="w-full border-2 border-gray-800 rounded-lg p-2.5 font-medium text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <!-- Tamaño + documento -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-800 mb-1 ml-1">Tamaño</label>
            <div class="relative">
              <input
                v-model="form.tamano"
                type="text"
                class="w-full border-2 border-gray-800 rounded-lg p-2.5 font-medium text-sm text-gray-900 bg-white focus:outline-none pr-8"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 font-bold text-sm pointer-events-none"
                >m²</span
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-800 mb-1 ml-1">Documento Legal</label>
            <input
              v-model="form.documento"
              type="text"
              class="w-full border-2 border-gray-800 rounded-lg p-2.5 font-medium text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Sección de características -->
      <div class="mt-6">
        <h3 class="text-xl font-bold text-black mb-3">Detalles del Inmueble</h3>

        <!-- Formulario agregar/editar característica -->
        <div class="border border-gray-300 rounded-[20px] p-4 relative mb-4">
          <p class="text-xs font-bold text-gray-800 mb-2">
            {{
              idCaracteristicaEditando
                ? "Editando Característica"
                : "Agregar Características del Inmueble"
            }}
          </p>

          <!-- Inputs para nombre/valor -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label class="block text-xs font-bold text-gray-800 mb-1">Tipo de Propiedad</label>
              <input
                v-model="carNombre"
                placeholder="Ej: Departamento"
                type="text"
                class="w-full bg-gray-200 rounded-lg p-2.5 text-sm text-gray-600 font-medium placeholder-gray-400 border-none focus:ring-0"
                @keyup.enter="guardarCaracteristica"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-800 mb-1">Característica</label>
              <input
                v-model="carValor"
                placeholder="Ej: Residencial"
                type="text"
                class="w-full bg-gray-200 rounded-lg p-2.5 text-sm text-gray-600 font-medium placeholder-gray-400 border-none focus:ring-0"
                @keyup.enter="guardarCaracteristica"
              />
            </div>
          </div>

          <!-- Botón guardar característica -->
          <div class="flex justify-end mt-3">
            <button
              @click="guardarCaracteristica"
              class="bg-black hover:bg-gray-800 text-white rounded-lg w-9 h-9 flex items-center justify-center transition-all shadow-md"
              :title="idCaracteristicaEditando ? 'Actualizar' : 'Agregar'"
            >
              <!-- Icono actualizar -->
              <svg
                v-if="idCaracteristicaEditando"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>

              <!-- Icono agregar -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tabla de características -->
        <div
          v-if="caracteristicas.length > 0"
          class="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100"
        >
          <!-- Encabezado -->
          <div
            class="grid grid-cols-[1fr_2fr_80px] px-5 py-2 text-xs font-bold text-gray-800 bg-gray-100/50 border-b border-gray-200"
          >
            <span>Tipo</span><span>Característica</span><span class="text-right">Acciones</span>
          </div>

          <!-- Lista -->
          <div class="divide-y divide-gray-200">
            <div
              v-for="item in caracteristicas"
              :key="item.id"
              class="grid grid-cols-[1fr_2fr_80px] items-center px-5 py-3 bg-gradient-to-b from-white to-gray-50/50"
              :class="{ 'bg-gray-100': idCaracteristicaEditando === item.id }"
            >
              <span class="text-sm font-bold text-gray-800">{{ item.nombre }}</span>
              <span class="text-sm font-bold text-gray-800">{{ item.valor }}</span>

              <!-- Botones de editar y eliminar -->
              <div class="flex justify-end gap-2">
                <!-- Editar -->
                <button
                  @click="editarCaracteristica(item)"
                  class="text-gray-800 hover:scale-110 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>

                <!-- Eliminar -->
                <button
                  @click="eliminarCaracteristica(item.id)"
                  class="text-gray-800 hover:scale-110 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones finales -->
      <div class="flex justify-end space-x-3 mt-6 pt-2">
        <button
          @click="$emit('close')"
          class="px-8 py-2.5 border-2 border-gray-400 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          @click="guardarCambios"
          class="px-6 py-2.5 bg-black text-blanco-primario rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
            />
          </svg>
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>