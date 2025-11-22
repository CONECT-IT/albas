<template>
  <div class="min-h-screen bg-naranja-terciario">
    <nav class="">
      <div class="px-8">
        <div class="flex justify-between items-center h-20">
          <div>
            <NuxtImg src="/Logo.png" class="object-scale-down h-[60px]" alt="Albas Logo" />
          </div>
          <div class="flex space-x-6 text-negro-primario">
            <NuxtLink
              to="/admin/asesores"
              class="relative px-4 py-2 hover:text-gray-300 transition-colors duration-200"
            >
              asesores
              <span
                v-if="$route.path === '/admin/asesores'"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-white"
              ></span>
            </NuxtLink>
            <NuxtLink
              to="/admin/leads"
              class="relative px-4 py-2 hover:text-gray-300 transition-colors duration-200"
            >
              leads
              <span
                v-if="$route.path === '/admin/leads'"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-white"
              ></span>
            </NuxtLink>
            <NuxtLink
              to="/admin/ventas"
              class="relative px-4 py-2 hover:text-gray-300 transition-colors duration-200"
            >
              ventas
              <span
                v-if="$route.path === '/admin/ventas'"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-white"
              ></span>
            </NuxtLink>
          </div>
          <div class="flex ml-3 items-center bg-dorado-terciario rounded-4xl p-4">
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
                class="ml-4 px-4 py-2 flex items-center text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
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
