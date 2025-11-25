<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(["close", "crear"]);

const nombre = ref("");
const celular = ref("");
const fecha = ref("");
const tipo = ref("");

const crearLead = () => {
  emit("crear", {
    nombre: nombre.value,
    celular: celular.value,
    fecha: fecha.value,
    tipo: tipo.value,
  });

  emit("close");
};
</script>

<template>
  <!--DESENFOCADO -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition duration-200"
    @click="$emit('close')"
  ></div>

  <!-- MODAL -->
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-8 shadow-xl w-[600px]" @click.stop>

      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold">Nuevo Lead</h2>
          <p class="text-gray-400">Ingrese la información del Lead</p>
        </div>
        <button 
          class="text-2xl font-bold"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Formulario -->
      <div class="grid grid-cols-2 gap-6">

        <!-- Nombre Completo -->
        <div>
          <label class="block text-sm font-semibold mb-1">Nombre Completo</label>
          <input 
            v-model="nombre"
            type="text"
            class="w-full border rounded-md p-2"
          >
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm font-semibold mb-1">Fecha</label>
          <input 
            v-model="fecha"
            type="date"
            class="w-full border rounded-md p-2"
          >
        </div>

        <!-- Celular -->
        <div>
          <label class="block text-sm font-semibold mb-1">Número de Celular</label>
          <input 
            v-model="celular"
            type="text"
            class="w-full border rounded-md p-2"
          >
        </div>

        <!-- Tipo -->
        <div>
          <label class="block text-sm font-semibold mb-1">Tipo</label>
          <select 
            v-model="tipo"
            class="w-full border rounded-md p-2"
          >
            <option disabled value="">Seleccione</option>
            <option>Alvas</option>
            <option>Propios</option>
            <option>Referido</option>
          </select>
        </div>

      </div>

      <!-- Botones -->
      <div class="flex justify-end space-x-4 mt-8">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 border rounded-md"
        >
          Cancelar
        </button>

        <button 
          @click="crearLead"
          class="px-4 py-2 bg-black text-white rounded-md"
        >
          Crear Lead
        </button>
      </div>

    </div>
  </div>
</template>
