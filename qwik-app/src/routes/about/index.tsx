import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { ThemeChanger } from "qwik-themes-testing-donlos-version-1";
export default component$(() => {
  return (
    <>
      <ThemeChanger />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id iste
        adipisci voluptatum at nesciunt necessitatibus nobis, rem mollitia culpa
        praesentium quae numquam ad cumque ea neque veniam reiciendis porro.
        Voluptatem.
      </p>
      <p>about page</p>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </>
  );
});

export const head: DocumentHead = {
  title: "About Page",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
