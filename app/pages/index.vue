<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div
            class="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center"
        >
            <h1 class="text-2xl font-bold text-gray-900 mb-4">
                Sistema de Ventas
            </h1>
            <p class="text-gray-600 mb-6">
                Por favor inicie sesión para continuar
            </p>
            <NuxtLink
                to="/login"
                class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Iniciar Sesión
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "auth",
});

const { loggedIn, user, fetch: fetchUser } = useUserSession();

if (loggedIn.value) {
    if (!user.value?.roles) {
        await fetchUser();
    }

    if (user.value?.roles?.includes("ADMINISTRADOR")) {
        await navigateTo("/admin");
    } else if (user.value?.roles?.includes("ASESOR_VENTAS")) {
        await navigateTo("/asesor");
    }
}
</script>
