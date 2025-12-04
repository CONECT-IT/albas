<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

/* ============================================================
   DEFINICIÓN DE PROPS RECIBIDOS Y EVENTOS QUE EL COMPONENTE EMITE
   ============================================================ */
const props = defineProps<{
  lead?: any;
  propiedad?: any;
}>();

/* Eventos que este componente enviará al componente padre */
const emit = defineEmits(["close", "crear", "actualizar"]);

/* Detectamos si estamos editando una propiedad existente */
const esEdicion = computed(() => !!props.propiedad);

/* ============================================================
   ESTADO DEL FORMULARIO PRINCIPAL
   ============================================================ */
const form = ref({
  nombre: "",
  precio: "",
  ubicacion: "",
  tamano: "",
  partida: "",
});

/* ============================================================
   ESTADO DE CARACTERÍSTICAS INDIVIDUALES
   ============================================================ */
const carNombre = ref("");
const carValor = ref("");
const caracteristicas = ref<{ id: number; nombre: string; valor: string }[]>([]);
const idCaracteristicaEditando = ref<number | null>(null);

/* ============================================================
   CARGA INICIAL DE DATOS CUANDO ES EDICIÓN
   ============================================================ */
onMounted(() => {
  if (props.propiedad) {
    form.value = { ...props.propiedad }; // Copia de datos

    if (props.propiedad.detalles) {
      // Clonamos los detalles para no mutar directamente la propiedad original
      caracteristicas.value = props.propiedad.detalles.map((d: any) => ({ ...d }));
    }
  }
});

/* ============================================================
   FUNCIÓN PARA AGREGAR O ACTUALIZAR UNA CARACTERÍSTICA
   ============================================================ */
const guardarCaracteristica = () => {
  // Validación simple para evitar valores vacíos
  if (carNombre.value.trim() && carValor.value.trim()) {
    if (idCaracteristicaEditando.value !== null) {
      // Si estamos actualizando una existente, la buscamos y actualizamos
      const index = caracteristicas.value.findIndex((c) => c.id === idCaracteristicaEditando.value);
      if (index !== -1) {
        caracteristicas.value[index].nombre = carNombre.value;
        caracteristicas.value[index].valor = carValor.value;
      }

      // Salimos del modo edición
      idCaracteristicaEditando.value = null;
    } else {
      // Si es una nueva característica, la agregamos con un ID temporal
      caracteristicas.value.push({
        id: Date.now(),
        nombre: carNombre.value,
        valor: carValor.value,
      });
    }

    // Limpiamos inputs
    carNombre.value = "";
    carValor.value = "";
  }
};

/* ============================================================
   FUNCIÓN PARA EDITAR UNA CARACTERÍSTICA (CARGA EN INPUTS)
   ============================================================ */
const editarCaracteristica = (item: any) => {
  carNombre.value = item.nombre;
  carValor.value = item.valor;
  idCaracteristicaEditando.value = item.id;
};

/* ============================================================
   FUNCIÓN PARA ELIMINAR UNA CARACTERÍSTICA
   ============================================================ */
const eliminarCaracteristica = (id: number) => {
  caracteristicas.value = caracteristicas.value.filter((c) => c.id !== id);

  // Si la característica eliminada estaba en edición, limpiamos todo
  if (idCaracteristicaEditando.value === id) {
    idCaracteristicaEditando.value = null;
    carNombre.value = "";
    carValor.value = "";
  }
};

/* ============================================================
   FUNCIÓN PRINCIPAL PARA GUARDAR LA PROPIEDAD
   ============================================================ */
const handleSubmit = () => {
  // Validación básica
  if (!form.value.nombre || !form.value.precio) {
    alert("Por favor ingrese al menos el Nombre y el Precio.");
    return;
  }

  // Estructura completa del objeto a enviar al padre
  const datosFinales = {
    ...form.value,
    detalles: caracteristicas.value,
    leadId: props.lead?.id,
  };

  // Si estamos editando, emitimos "actualizar"
  if (esEdicion.value) {
    emit("actualizar", datosFinales);
  } else {
    // Si es nuevo, emitimos "crear"
    emit("crear", datosFinales);
  }

  // Cerramos modal
  emit("close");
};
</script>

<!-- ================= TEMPLATE ================= -->

<template>
  <!-- Fondo oscuro del modal -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="$emit('close')"></div>

  <!-- Contenedor principal del modal -->
  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
    <!-- Caja blanca del modal -->
    <div
      class="bg-white rounded-[24px] p-8 shadow-2xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto pointer-events-auto font-sans relative flex flex-col"
    >
      <!-- Botón cerrar (X) -->
      <button
        class="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Título -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-black">
          {{ esEdicion ? "Editar Propiedad" : "Agregar Nueva Propiedad" }}
        </h2>
        <p class="text-gray-400 text-sm mt-1">
          {{
            esEdicion
              ? "Modifica los datos de la propiedad."
              : "Completa la información de la nueva propiedad."
          }}
        </p>
      </div>

      <!-- ================== FORMULARIO PRINCIPAL ================== -->

      <div class="space-y-4">
        <!-- Campo Nombre -->
        <div>
          <label class="block text-sm font-bold text-gray-800 mb-1">Nombre</label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej: Terreno Vista Hermosa"
            class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-black transition-colors"
          />
        </div>

        <!-- Precio + Ubicación -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-800 mb-1">Precio ($)</label>
            <input
              v-model="form.precio"
              type="number"
              placeholder="30000"
              class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-800 mb-1">Ubicación</label>
            <input
              v-model="form.ubicacion"
              type="text"
              placeholder="Ej: Zona Norte"
              class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <!-- Tamaño + Partida -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-800 mb-1">Tamaño</label>
            <div class="relative">
              <input
                v-model="form.tamano"
                type="number"
                placeholder="500"
                class="w-full border border-gray-300 rounded-lg p-2.5 pr-10 bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-black transition-colors"
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm pointer-events-none"
              >
                m²
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-800 mb-1">Partida Registral</label>
            <input
              v-model="form.partida"
              type="text"
              placeholder="Ej: P-12345"
              class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- ================== SECCIÓN DE CARACTERÍSTICAS ================== -->

      <div class="mt-8">
        <h3 class="text-xl font-bold text-black mb-4">Detalles del Inmueble</h3>

        <!-- Caja para agregar o editar característica -->
        <div
          class="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative mb-4 transition-colors"
          :class="{ 'border-gray-400 bg-gray-100': idCaracteristicaEditando !== null }"
        >
          <p
            class="text-xs font-bold mb-3"
            :class="idCaracteristicaEditando !== null ? 'text-black' : 'text-gray-600'"
          >
            {{
              idCaracteristicaEditando !== null
                ? "Editando Característica..."
                : "Agregar Características del Inmueble"
            }}
          </p>

          <!-- Inputs pequeños -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1"
                >Tipo de Propiedad</label
              >
              <input
                v-model="carNombre"
                type="text"
                placeholder="Ej: Departamento"
                class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm outline-none focus:border-black transition-colors"
                @keyup.enter="guardarCaracteristica"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Característica</label>
              <input
                v-model="carValor"
                type="text"
                placeholder="Ej: Residencial"
                class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm outline-none focus:border-black transition-colors"
                @keyup.enter="guardarCaracteristica"
              />
            </div>
          </div>

          <!-- Botón agregar / actualizar -->
          <div class="flex justify-end mt-2">
            <button
              @click="guardarCaracteristica"
              class="text-white bg-black rounded-lg w-8 h-8 flex items-center justify-center shadow-lg active:scale-95 hover:bg-gray-800 transition-colors"
              :title="idCaracteristicaEditando !== null ? 'Actualizar' : 'Agregar'"
            >
              <!-- Ícono actualizar -->
              <svg
                v-if="idCaracteristicaEditando !== null"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>

              <!-- Ícono agregar -->
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
          class="rounded-lg overflow-hidden border border-gray-200"
        >
          <!-- Encabezado -->
          <div
            class="grid grid-cols-[1fr_2fr_80px] px-4 py-3 text-xs font-bold text-gray-600 bg-gray-50 border-b border-gray-200"
          >
            <span>Nombre</span>
            <span>Valor</span>
            <span class="text-right">Acciones</span>
          </div>

          <!-- Filas -->
          <div class="divide-y divide-gray-100 bg-white">
            <div
              v-for="item in caracteristicas"
              :key="item.id"
              class="grid grid-cols-[1fr_2fr_80px] items-center px-4 py-3 transition-colors"
              :class="item.id === idCaracteristicaEditando ? 'bg-gray-100' : ''"
            >
              <span class="text-sm font-semibold text-gray-800">
                {{ item.nombre }}
              </span>

              <span class="text-sm font-medium text-gray-600">
                {{ item.valor }}
              </span>

              <!-- Botones editar y eliminar -->
              <div class="flex justify-end space-x-2">
                <!-- Editar -->
                <button
                  @click="editarCaracteristica(item)"
                  class="text-gray-400 hover:text-black transition-colors"
                  title="Editar"
                >
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 
                         0 1 1 2.652 2.652L10.582 16.07a4.5 
                         4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 
                         4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 
                         0L19.5 7.125M18 14v4.75A2.25 
                         2.25 0 0 1 15.75 21H5.25A2.25 
                         2.25 0 0 1 3 18.75V8.25A2.25 
                         2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>

                <!-- Eliminar -->
                <button
                  @click="eliminarCaracteristica(item.id)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
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
                      d="m14.74 9-.346 9m-4.788 
                         0L9.26 9m9.968-3.21c.342.052.682.107 
                         1.022.166m-1.022-.165L18.16 
                         19.673a2.25 2.25 0 0 1-2.244 
                         2.077H8.084a2.25 2.25 
                         0 0 1-2.244-2.077L4.772 
                         5.79m14.456 0a48.108 
                         48.108 0 0 0-3.478-.397m-12 
                         .562c.34-.059.68-.114 
                         1.022-.165m0 0a48.11 
                         48.11 0 0 1 3.478-.397m7.5 
                         0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                         51.964 0 0 0-3.32 0c-1.18.037-2.09 
                         1.022-2.09 2.201v.916m7.5 
                         0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= BOTONES FINALES ================= -->

      <div class="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
        <button
          @click="$emit('close')"
          class="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <button
          @click="handleSubmit"
          class="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
        >
          {{ esEdicion ? "Guardar Cambios" : "Crear Propiedad" }}
        </button>
      </div>
    </div>
  </div>
</template>
