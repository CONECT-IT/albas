<template>
  <div class="flex ml-3 justify-center min-h-screen bg-gray-50">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p class="text-gray-600 mb-6">
        No tienes los permisos necesarios para acceder a esta página.
      </p>
      <NuxtLink
        to="/"
        class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Volver al Inicio
      </NuxtLink>
    </div>
  </div>
</template>
