<template>
  <div class="grid grid-cols-5">
    <div class="flex col-span-2 items-center justify-center min-h-screen">
      <div class="max-w-md w-full space-y-8 p-10">
        <div class="flex items-center justify-center">
          <NuxtImg class="h-52" src="/Logo.png" alt="Logo" />
        </div>
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-negro-secundario">
            Iniciar Sesión
          </h2>
        </div>
        <form class="mt-8 space-y-7 gap-2" @submit.prevent="handleLogin">
          <div class="rounded-md -space-y-px">
            <div>
              <span class="text-negro-secundario font-semibold"> Usuario </span>
              <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                class="appearance-none rounded-3xl relative my-2 block w-full px-3 py-2 border border-negro-secundario placeholder-gray-500 text-gray-900 focus:outline-none"
                placeholder="Usuario"
              />
            </div>
            <div>
              <span class="text-negro-secundario font-semibold"> Contraseña </span>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="appearance-none rounded-3xl relative block my-2 w-full px-3 py-2 pr-10 border border-negro-secundario placeholder-gray-500 text-gray-900 focus:outline-none"
                  placeholder="********"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  @click="showPassword = !showPassword"
                >
                  <svg
                    v-if="showPassword"
                    class="h-5 w-5 text-negro-secundario"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-5.06 5.94M1 1l22 22M2 2l20 20"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-5 w-5 text-negro-secundario"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[30px] text-white bg-negro-secundario hover:bg-negro-primario focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-negro-secundario"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <!-- Heroicon name: solid/lock-closed -->
                <svg
                  class="h-5 w-5 text-white"
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
              {{ loading ? "Iniciando sesión..." : "Ingresar" }}
            </button>
          </div>

          <div v-if="error" class="text-red-600 text-center">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
    <div class="col-start-3 col-span-3 flex items-center justify-center min-h-screen p-0 m-0">
      <NuxtImg
        src="/FotoLogin1.png"
        alt="Background"
        class="h-full w-full object-cover object-bottom-left"
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

  if (user.value?.roles?.includes("Administrador")) {
    await navigateTo("/admin");
  } else if (user.value?.roles?.includes("Asesor")) {
    await navigateTo("/asesor");
  } else {
    await navigateTo("/");
  }
}

const username = ref("");
const password = ref("");
const showPassword = ref(false);
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
  } catch (err: any) {
    if (err.data && err.data.message) {
      error.value = err.data.message;
    } else if (err.message) {
      error.value = err.message;
    } else {
      error.value = "Error al iniciar sesión";
    }
  } finally {
    loading.value = false;
  }
};
</script>
