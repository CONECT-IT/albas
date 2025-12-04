<template>
  <!-- FONDO OSCURO -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="$emit('close')"></div>

  <!-- CONTENEDOR DEL MODAL -->
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
    <div
      class="bg-white rounded-[28px] shadow-2xl p-10 w-[900px] border border-gray-200 pointer-events-auto relative max-h-[90vh] overflow-y-auto"
    >

      <!-- BOTÓN CERRAR -->
      <button
        class="absolute top-6 right-6 text-gray-500 hover:text-black transition p-1 rounded-full hover:bg-gray-100"
        @click="$emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             stroke-width="2" stroke="currentColor" fill="none"
             class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- TÍTULO -->
      <h2 class="text-3xl font-bold">Visualización de Propiedades</h2>
      <p class="text-gray-500 text-sm mt-1 mb-6">
        Visualice las propiedades asociadas al cliente.
      </p>

      <!-- SELECT DE PROPIEDADES -->
      <label class="block text-sm mb-2 font-semibold">Seleccione una propiedad</label>
      <select
        v-model="form.propiedadId"
        class="w-[350px] bg-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-800 shadow-inner appearance-none cursor-pointer"
      >
        <option disabled value="">Seleccionar...</option>
        <option 
          v-for="prop in listaPropiedades"
          :key="prop.id"
          :value="prop.id"
        >
          {{ prop.nombre }}
        </option>
      </select>

      <!-- INFORMACIÓN DE PROPIEDAD -->
      <h3 class="text-xl font-bold mt-10 mb-3">Información de Propiedad</h3>

      <div class="bg-gray-100 rounded-2xl overflow-hidden border border-gray-300/70">
        <table class="w-full text-sm">
          <thead class="bg-negro-primario border-b border-gray-300">
            <tr>
              <th class="py-3 px-0 text-blanco-primario">Nombre de Propiedad</th>
              <th class="py-3 px-4 text-blanco-primario">Ubicación</th>
              <th class="py-3 px-4 text-blanco-primario">Tamaño</th>
              <th class="py-3 px-4 text-blanco-primario">Monto</th>
              <th class="py-3 px-4 text-blanco-primario">Partida Registral</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="py-3 pl-4">{{ datosPropiedad.tipo }}</td>
              <td class="py-3 pl-10">{{ datosPropiedad.direccion }}</td>
              <td class="py-3 pl-9">{{ datosPropiedad.tamano }}</td>
              <td class="py-3 pl-4">{{ datosPropiedad.monto }}</td>
              <td class="py-3 pl-9">{{ datosPropiedad.partida }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- DETALLES DEL INMUEBLE -->
      <h3 class="text-xl font-bold mt-10 mb-3">Detalles del Inmueble</h3>

      <div class="bg-gray-100 rounded-2xl overflow-hidden border border-gray-300/70">
        <table class="w-full border-collapse table-fixed text-sm">
          <thead class="bg-negro-primario border-b border-gray-300">
            <tr>
              <th class="py-2  pl-5 text-left text-blanco-primario">Tipo de Propiedad</th>
              <th class="py-2 pl-35 text-blanco-primario">Características del Inmueble</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="py-3 pl-5">{{ datosPropiedad.tipo }}</td>
              <td class="py-3 pl-50">{{ datosPropiedad.servicios }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps<{
  propiedadesDisponibles?: {
    id: number;
    nombre: string;
    direccion: string;
    tipo: string;
    tamano: string;
    monto: string;
    partida: string;
    servicios: string;
  }[];
}>();

const emit = defineEmits(["close"]);

// --------------------- DATOS FICTICIOS POR DEFECTO ----------------------
const listaPropiedades = computed(() =>
  props.propiedadesDisponibles || [
    {
      id: 1,
      nombre: "Residencial Las Palmeras",
      direccion: "Av. Miraflores 452, Tacna",
      tipo: "Departamento",
      tamano: "85 m²",
      monto: "S/ 230,000",
      partida: "PR-5547882",
      servicios: "Luz, Agua, Desagüe, Gas"
    },
    {
      id: 2,
      nombre: "Casa Familiar San Martín",
      direccion: "Jr. San Martín 980, Tacna",
      tipo: "Casa",
      tamano: "150 m²",
      monto: "S/ 380,000",
      partida: "PR-9988776",
      servicios: "Luz, Agua, Desagüe"
    },
    {
      id: 3,
      nombre: "Terreno Campestre La Pradera",
      direccion: "Km 7 Via Pocollay, Tacna",
      tipo: "Terreno",
      tamano: "200 m²",
      monto: "S/ 45,000",
      partida: "PR-2211344",
      servicios: "No disponible"
    }
  ]
);

// ----------------------- FORM Y DATOS VISIBLES ----------------------
const form = ref({
  propiedadId: ""
});

const datosPropiedad = ref({
  nombre: "",
  direccion: "",
  tipo: "",
  tamano: "",
  monto: "",
  partida: "",
  servicios: ""
});

// Al cambiar el select
watch(() => form.value.propiedadId, (nuevoId) => {
  const seleccion = listaPropiedades.value.find(p => p.id == nuevoId);
  if (seleccion) {
    datosPropiedad.value = { ...seleccion };
  }
});

// ------------------ SELECCIONAR LA PRIMERA PROPIEDAD AUTOMÁTICAMENTE ------------------
onMounted(() => {
  if (listaPropiedades.value.length > 0) {
    form.value.propiedadId = listaPropiedades.value[0].id;
    datosPropiedad.value = { ...listaPropiedades.value[0] };
  }
});
</script>


