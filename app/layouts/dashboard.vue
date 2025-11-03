<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <div class="shrink-0 flex items-center">
                            <span class="text-xl font-bold text-indigo-600"
                                >Albas</span
                            >
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div class="ml-3 relative">
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
                                    class="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <main>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession();

const handleLogout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    await clear();
    await navigateTo("/login");
};
</script>
