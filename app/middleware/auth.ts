export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user, fetch: fetchUser } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/");
  }

  if (!user.value?.rol) {
    await fetchUser();
  }

  const requiredRoles = (to.meta.requiredRoles as string[]) || [];

  if (requiredRoles.length > 0) {
    const hasRole = requiredRoles.includes(user.value?.rol || "");

    if (!hasRole) {
      return navigateTo("/unauthorized");
    }
  }
});
