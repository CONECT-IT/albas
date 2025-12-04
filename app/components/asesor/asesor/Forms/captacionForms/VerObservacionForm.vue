<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40">
    <div class="bg-white rounded-2xl shadow-xl w-[750px] p-8 relative">
      <!-- Botón cerrar -->
      <button
        @click="cerrar"
        class="absolute top-4 right-4 text-2xl leading-none"
        aria-label="Cerrar"
      >
        ✕
      </button>

      <!-- Título -->
      <h2 class="text-2xl font-semibold mb-1">Observaciones</h2>
      <p class="text-sm text-gray-500 mb-4">Seleccione una propiedad</p>

      <!-- SELECT funcional: lista de propiedades -->
      <select
        v-model="propiedadSeleccionada"
        class="w-full bg-gray-200 px-4 py-2 rounded-lg mb-6 outline-none cursor-pointer"
      >
        <option disabled value="">Seleccione una propiedad</option>
        <option v-for="(item, idx) in listaObservaciones" :key="idx" :value="item.propiedad">
          {{ item.propiedad }}
        </option>
      </select>

      <!-- Caja de observación en solo lectura -->
      <textarea
        :value="comentarioMostrado"
        readonly
        class="w-full min-h-[140px] bg-gradient-to-b from-white to-gray-100 shadow rounded-2xl p-6 text-center text-lg font-medium resize-none mb-4 break-words"
      ></textarea>

      <!-- Botón Cerrar -->
      <div class="flex justify-end">
        <button @click="cerrar" class="px-6 py-2 rounded-lg border">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  // opcional: lista de observaciones en formato { propiedad: string, comentario: string }
  observaciones: {
    type: Array as () => { propiedad: string; comentario: string }[] | undefined,
    required: false,
  },
  // opcional: propiedad a preseleccionar
  propiedadInicial: { type: String, required: false, default: "" },
});

const emit = defineEmits(["close"]);

const propiedadSeleccionada = ref("");

// Si no pasan observaciones, usamos datos ficticios
const listaObservaciones = computed(() => {
  if (Array.isArray(props.observaciones) && props.observaciones.length > 0) {
    return props.observaciones;
  }
  return [
    {
      propiedad: "Vista Hermosa",
      comentario: "Cliente necesita financiamiento. Revisar opciones bancarias disponibles.",
    },
    {
      propiedad: "Residencial Los Pinos",
      comentario: "Enviar documentación faltante: copia DNI y boleta de servicio.",
    },
    {
      propiedad: "Terreno La Pradera",
      comentario: "Verificar linderos y metraje exacto antes de ofertar.",
    },
  ];
});

// Inicialización: seleccionar propiedadInicial o la primera disponible
onMounted(() => {
  if (props.propiedadInicial) {
    propiedadSeleccionada.value = props.propiedadInicial;
  } else if (listaObservaciones.value.length > 0) {
    propiedadSeleccionada.value = listaObservaciones.value[0].propiedad;
  } else {
    propiedadSeleccionada.value = "";
  }
});

// Si la lista cambia y la propiedad actual ya no existe, reajustar
watch(
  () => listaObservaciones.value,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      propiedadSeleccionada.value = "";
      return;
    }
    const existe = newVal.some((o) => o.propiedad === propiedadSeleccionada.value);
    if (!existe) {
      propiedadSeleccionada.value = newVal[0].propiedad;
    }
  },
  { deep: true },
);

// Computed que devuelve el comentario de la propiedad seleccionada
const comentarioMostrado = computed(() => {
  if (!propiedadSeleccionada.value) return "";
  const found = listaObservaciones.value.find((o) => o.propiedad === propiedadSeleccionada.value);
  return found ? found.comentario : "";
});

function cerrar() {
  emit("close");
}
</script>

<style scoped>
/* scrollbar opcional */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 10px;
}

/* responsive pequeño */
@media (max-width: 780px) {
  :root .w-\[750px\] {
    width: calc(100% - 32px);
  }
}
</style>
