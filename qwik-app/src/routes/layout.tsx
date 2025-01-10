import { Slot, component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
// import { ThemeChanger } from "qwik-themes-testing-donlos-version-1";
import { Header } from "~/components/header";
import { NavLink } from "~/components/navlinks";
import { ThemeChanger } from "../../../../qwik-themes/src";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <>
      <Header>
        <NavLink href="/">Home</NavLink>
        <ThemeChanger />
        <NavLink href="/about/">About</NavLink>
      </Header>
      <Slot />
    </>
  );
});
