<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Asesores</h1>
      <button
        @click="showCreateForm = !showCreateForm"
        class="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ showCreateForm ? "Cancelar" : "Crear Nuevo Asesor" }}
      </button>
    </div>

    <!-- Formulario para crear nuevo asesor -->
    <div v-if="showCreateForm" class="bg-white rounded-lg text-black shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Crear Nuevo Asesor</h2>
      <form @submit.prevent="crearAsesor" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Nombre de Usuario * </label>
          <input
            v-model="nuevoAsesor.nombre_usuario"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de usuario"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Contraseña * </label>
          <input
            v-model="nuevoAsesor.contrasena"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contraseña"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Correo Electrónico * </label>
          <input
            v-model="nuevoAsesor.correo"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Nombres * </label>
          <input
            v-model="nuevoAsesor.nombres"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombres completos"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Apellidos </label>
          <input
            v-model="nuevoAsesor.apellidos"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apellidos"
          />
        </div>
        <div class="md:col-span-2">
          <button
            type="submit"
            :disabled="cargandoCreacion"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ cargandoCreacion ? "Creando..." : "Crear Asesor" }}
          </button>
        </div>
      </form>
      <div v-if="mensajeCreacion" :class="mensajeCreacion.tipo" class="mt-4 p-3 rounded-md">
        {{ mensajeCreacion.texto }}
      </div>
    </div>

    <!-- Lista de asesores -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Lista de Asesores</h2>
      <div v-if="cargando" class="text-center py-8">
        <p>Cargando asesores...</p>
      </div>
      <div v-else-if="asesores.length === 0" class="text-center py-8">
        <p>No hay asesores registrados.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Nombre de Usuario
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Nombres
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Apellidos
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Correo
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="asesor in asesores" :key="asesor.id_usuario">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                {{ asesor.id_usuario }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ asesor.nombre_usuario }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                {{ asesor.nombres }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                {{ asesor.apellidos || "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                {{ asesor.correo }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

const showCreateForm = ref(false);
const cargando = ref(true);
const cargandoCreacion = ref(false);
const mensajeCreacion = ref<{ tipo: string; texto: string } | null>(null);

const nuevoAsesor = ref({
  nombre_usuario: "",
  contrasena: "",
  correo: "",
  nombres: "",
  apellidos: "",
});

const asesores = ref([]);

onMounted(async () => {
  await cargarAsesores();
});

const cargarAsesores = async () => {
  try {
    const data = await $fetch("/api/admin/asesores");
    asesores.value = data.data || [];
  } catch (error: any) {
    console.error("Error al cargar asesores:", error);
  } finally {
    cargando.value = false;
  }
};

const crearAsesor = async () => {
  cargandoCreacion.value = true;
  mensajeCreacion.value = null;

  try {
    const data = await $fetch("/api/admin/asesores", {
      method: "POST",
      body: {
        nombre_usuario: nuevoAsesor.value.nombre_usuario,
        contrasena: nuevoAsesor.value.contrasena,
        correo: nuevoAsesor.value.correo,
        nombres: nuevoAsesor.value.nombres,
        apellidos: nuevoAsesor.value.apellidos || null,
      },
    });

    // Limpiar formulario
    nuevoAsesor.value = {
      nombre_usuario: "",
      contrasena: "",
      correo: "",
      nombres: "",
      apellidos: "",
    };

    // Actualizar lista de asesores
    await cargarAsesores();

    mensajeCreacion.value = {
      tipo: "bg-green-100 text-green-800",
      texto: data.message || "Asesor creado exitosamente",
    };

    // Ocultar formulario después de crear exitosamente
    showCreateForm.value = false;
  } catch (error: any) {
    mensajeCreacion.value = {
      tipo: "bg-red-100 text-red-800",
      texto: error.data?.message || error.message || "Error al crear asesor",
    };
  } finally {
    cargandoCreacion.value = false;
  }
};
</script>
