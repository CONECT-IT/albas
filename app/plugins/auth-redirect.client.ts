export default defineNuxtPlugin(() => {
  const { $auth } = useNuxtApp();

  if (process.client) {
    const { loggedIn, user, fetch: fetchUser } = useUserSession();

    const redirectToRoleDashboard = async () => {
      if (loggedIn.value) {
        if (!user.value?.rol) {
          await fetchUser();
        }

        if (user.value?.rol?.includes("Administrador")) {
          await navigateTo("/admin");
        } else if (user.value?.rol?.includes("Asesor")) {
          await navigateTo("/asesor");
        }
      }
    };

    watch(loggedIn, async (newLoggedIn) => {
      if (newLoggedIn) {
        await redirectToRoleDashboard();
      }
    });
  }
});
