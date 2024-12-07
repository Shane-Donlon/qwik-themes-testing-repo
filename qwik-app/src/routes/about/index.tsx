import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
export default component$(() => {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id iste
        adipisci voluptatum at nesciunt necessitatibus nobis, rem mollitia culpa
        praesentium quae numquam ad cumque ea neque veniam reiciendis porro.
        Voluptatem.
      </p>
      <p>about page</p>
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
