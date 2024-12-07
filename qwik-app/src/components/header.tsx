import { component$, Slot } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header>
      <nav>
        <Slot />
      </nav>
    </header>
  );
});
