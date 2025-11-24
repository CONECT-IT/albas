<template>
  <div class="min-h-screen bg-naranja-terciario">
    <nav class="">
      <div class="px-8">
        <div class="flex justify-between items-center h-20">
          <div>
            <NuxtImg src="/Logo.png" class="object-scale-down h-[60px]" alt="Albas Logo" />
          </div>

          <div class="flex space-x-4 text-negro-primario ml-auto"> 
            <NuxtLink
              to="/asesor/captacion"
              class="flex items-center space-x-2 px-6 py-3 rounded-full font-bold shadow-md transition-all duration-200"
              :class="[$route.path.includes('/asesor/captacion') ? 'bg-dorado-terciario text-negro-primario shadow-lg' : 'bg-white text-negro-primario shadow-md']"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Captación</span>
            </NuxtLink>
            <NuxtLink
              to="/asesor/ventas"
              class="flex items-center space-x-2 px-6 py-3 rounded-full font-bold shadow-md transition-all duration-200"
              
              :class="[$route.path.includes('/asesor/ventas') ? 'bg-dorado-terciario text-negro-primario shadow-lg' : 'bg-white text-negro-primario shadow-md']"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Ventas</span>
            </NuxtLink>
          </div>
          
          <div class="flex ml-3 items-center bg-blanco-primario rounded-4xl p-4">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-negro-primario text-white font-semibold mr-3"
            >
              {{ user?.name?.charAt(0) || "U" }}
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm">
                <p class="font-medium text-gray-700">
                  {{ user?.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ user?.username }}
                </p>
              </div>
              
              <button
                @click="handleLogout"
                class="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-negro-primario hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="h-full p-4">
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession();

const handleLogout = async () => {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    await $fetch("/api/auth/logout", { method: "POST" });
    await clear();
    await navigateTo("/");
  }
};
</script>