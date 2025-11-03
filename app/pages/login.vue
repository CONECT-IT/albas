<template>
    <div class="grid grid-cols-5">
        <div class="flex col-span-2 items-center justify-center min-h-screen">
            <div class="max-w-md w-full space-y-8 p-10">
                <div class="flex items-center justify-center">
                    <NuxtImg class="h-52" src="/Logo.png" alt="Logo" />
                </div>
                <div>
                    <h2
                        class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                    >
                        Iniciar Sesión
                    </h2>
                </div>
                <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div>
                            <span class="text-black"> Usuario </span>
                            <input
                                id="username"
                                v-model="username"
                                name="username"
                                type="text"
                                required
                                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Usuario"
                            />
                        </div>
                        <div>
                            <span class="text-black"> Contraseña </span>
                            <input
                                id="password"
                                v-model="password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                required
                                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            :disabled="loading"
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span
                                class="absolute left-0 inset-y-0 flex items-center pl-3"
                            >
                                <!-- Heroicon name: solid/lock-closed -->
                                <svg
                                    class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                            {{
                                loading
                                    ? "Iniciando sesión..."
                                    : "Iniciar Sesión"
                            }}
                        </button>
                    </div>

                    <div v-if="error" class="text-red-600 text-center">
                        {{ error }}
                    </div>
                </form>
            </div>
        </div>
        <div
            class="col-start-3 col-span-3 flex items-center justify-center min-h-screen p-0 m-0"
        >
            <NuxtImg
                src="/FotoLogin1.png"
                alt="Background"
                class="h-full object-cover object-bottom-left"
            />
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
    } else {
        await navigateTo("/");
    }
}

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response = await $fetch("/api/auth/login", {
            method: "POST",
            body: {
                username: username.value,
                password: password.value,
            },
        });

        await fetchUser();

        if (user.value?.roles?.includes("ADMINISTRADOR")) {
            await navigateTo("/admin");
        } else if (user.value?.roles?.includes("ASESOR_VENTAS")) {
            await navigateTo("/asesor");
        } else {
            await navigateTo("/");
        }
    } catch (err: any) {
        error.value = err.message || "Error al iniciar sesión";
    } finally {
        loading.value = false;
    }
};
</script>
