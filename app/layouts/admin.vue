<template>
    <div class="min-h-screen bg-naranja-terciario">
        <nav class="">
            <div class="px-8">
                <div class="flex justify-between items-center h-20">
                    <NuxtLink to="/admin" class="cursor-pointer">
                        <NuxtImg
                            src="/Logo.png"
                            class="object-scale-down h-[60px]"
                            alt="Albas Logo"
                        />
                    </NuxtLink>
                    <div class="flex space-x-4 text-negro-primario">
                        <NuxtLink
                            to="/admin/asesores"
                            class="flex items-center space-x-2 px-4 py-2 rounded-full border border-negro-primario hover:bg-gray-100 transition-colors duration-200"
                            :class="{ 'bg-negro-primario text-white': $route.path === '/admin/asesores' }"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>Asesores</span>
                        </NuxtLink>
                        <NuxtLink
                            to="/admin/leads"
                            class="flex items-center space-x-2 px-4 py-2 rounded-full border border-negro-primario hover:bg-gray-100 transition-colors duration-200"
                            :class="{ 'bg-negro-primario text-white': $route.path === '/admin/leads' }"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            <span>Leads</span>
                        </NuxtLink>
                        <NuxtLink
                            to="/admin/ventas"
                            class="flex items-center space-x-2 px-4 py-2 rounded-full border border-negro-primario hover:bg-gray-100 transition-colors duration-200"
                            :class="{ 'bg-negro-primario text-white': $route.path === '/admin/ventas' }"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                            </svg>
                            <span>Ventas</span>
                        </NuxtLink>
                        <NuxtLink
                            to="/admin/landing"
                            class="flex items-center space-x-2 px-4 py-2 rounded-full border border-negro-primario hover:bg-gray-100 transition-colors duration-200"
                            :class="{ 'bg-negro-primario text-white': $route.path === '/admin/landing' }"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
                            </svg>
                            <span>Landing</span>
                        </NuxtLink>
                    </div>
                    <div
                        class="flex ml-3 items-center bg-dorado-terciario rounded-4xl p-4"
                    >
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
                                class="ml-4 w-10 h-10 flex items-center justify-center text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
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
