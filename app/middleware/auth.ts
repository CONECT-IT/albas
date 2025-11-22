export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user, fetch: fetchUser } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/");
  }

  if (!user.value?.roles) {
    await fetchUser();
  }

  const requiredRoles = (to.meta.requiredRoles as string[]) || [];

  if (requiredRoles.length > 0) {
    const hasRole = requiredRoles.some((role) => user.value?.roles?.includes(role));

    if (!hasRole) {
      return navigateTo("/unauthorized");
    }
  }
});
