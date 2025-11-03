export default defineNuxtPlugin(() => {
  const { $auth } = useNuxtApp();

  if (process.client) {
    const { loggedIn, user, fetch: fetchUser } = useUserSession();

    const redirectToRoleDashboard = async () => {
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
    };

    watch(loggedIn, async (newLoggedIn) => {
      if (newLoggedIn) {
        await redirectToRoleDashboard();
      }
    });
  }
});
