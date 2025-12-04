<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  lead: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "guardar"]);

// Copiamos los valores del lead
const nombre = ref("");
const celular = ref("");
const fecha = ref("");
const tipo = ref("");

watch(
  () => props.lead,
  (l) => {
    if (l) {
      nombre.value = l.nombre;
      celular.value = l.celular;
      fecha.value = l.fecha;
      tipo.value = l.tipo;
    }
  },
  { immediate: true },
);

const guardarCambios = () => {
  emit("guardar", {
    id: props.lead.id,
    nombre: nombre.value,
    celular: celular.value,
    fecha: fecha.value,
    tipo: tipo.value,
  });

  emit("close");
};
</script>

<template>
  <!-- Fondo desenfocado -->
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="$emit('close')"></div>

  <!-- Modal -->
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-3xl p-10 shadow-xl w-[480px] border border-gray-200 relative"
      @click.stop
    >
      <!--BOTON CERRAR-->
      <button
        class="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
        @click="$emit('close')"
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

      <!-- Encabezado -->
      <h2 class="text-2xl font-bold">Editar Lead</h2>
      <p class="text-gray-400 -mt-1 mb-8">Edite la información del lead</p>

      <!-- Campos -->
      <div class="space-y-5">
        <!-- Nombre -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Nombre Completo</label>
          <input
            v-model="nombre"
            type="text"
            class="w-full bg-gray-200 rounded-xl p-3 outline-none"
          />
        </div>

        <!-- Celular -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Celular</label>
          <input
            v-model="celular"
            type="text"
            class="w-full bg-gray-200 rounded-xl p-3 outline-none"
          />
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Fecha</label>
          <input
            v-model="fecha"
            type="date"
            class="w-full bg-gray-200 rounded-xl p-3 outline-none"
          />
        </div>

        <!-- Tipo -->
        <div>
          <label class="block text-sm text-gray-500 mb-1">Tipo</label>
          <input
            v-model="tipo"
            type="text"
            class="w-full bg-gray-200 rounded-xl p-3 outline-none"
          />
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-between mt-10">
        <!-- Cancelar -->
        <button @click="$emit('close')" class="px-6 py-2 rounded-xl border border-black">
          Cancelar
        </button>

        <!-- Guardar -->
        <button
          @click="guardarCambios"
          class="px-6 py-2 rounded-xl bg-negro-primario text-blanco-primario flex items-center gap-2"
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
              d="M3 7.5V6a2.25 2.25 0 0 1 2.25-2.25h10.5L21 8v10.5A2.25 2.25 0 0 1 18.75 20.75H5.25A2.25 2.25 0 0 1 3 18.75v-11.25Z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V8.25H7.5V3.75" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75v6" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15.75h6" />
          </svg>
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>
