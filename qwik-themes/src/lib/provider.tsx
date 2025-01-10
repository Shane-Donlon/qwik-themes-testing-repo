import {
  $,
  Fragment,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useOnWindow,
  useSignal,
  useStore,
  useTask$
} from "@builder.io/qwik";
import { disableAnimation, getSystemTheme, getTheme } from "./helper";
import { ThemeScript } from "./theme-script";
import type { Theme, ThemeProviderProps, UseThemeProps } from "./types";
const a = ""

const ThemeContext = createContextId<UseThemeProps>("theme-context");

export const useTheme = () => useContext(ThemeContext);

const defaultThemes = ["light", "dark"];

export const ThemeProvider = component$<ThemeProviderProps>(
  ({
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = true,
    storageKey = "theme",
    themes = defaultThemes,
    defaultTheme = enableSystem ? "system" : "light",
    attribute = "data-theme",
    value,
    nonce,
  }) => {
    const themeSig = useSignal<string | undefined | string[]>("");

    const attrs = !value ? themes.flat() : Object.values(value);

    const applyTheme = $((theme: Theme) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      // Join the array of attr if the theme is an array
      const computedResolved = Array.isArray(resolved)
        ? resolved.join(attribute === "class" ? " " : "-")
        : resolved;

      const name = value ? value[computedResolved] : computedResolved;

      disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;

      if (attribute === "class") {
        d.classList.remove(...attrs);

        if (name) d.classList.add(...name.split(" "));
      } else {
        if (name) {
          d.setAttribute(attribute, name);
        } else {
          d.removeAttribute(attribute);
        }
      }
    });

    const resolvedThemeStore = useStore({
      value: getTheme(storageKey),
      setResolvedTheme: $(function (this: any, theme: string) {
        this.value = theme;
      }),
    });

    const themeStore = useStore<UseThemeProps>({
      setTheme: $(function (this: UseThemeProps, theme) {
        themeSig.value = theme;

        try {
          localStorage.setItem(
            storageKey,
            Array.isArray(theme) ? theme.join(" ") : (theme as string)
          );
          if (theme === "light" || theme === "dark") {
            document.documentElement.style.colorScheme = theme;
            applyTheme(theme);
          }
          // ? see issue #3 may need to add an else in here for "brutalist" theme etc...
        } catch (e) {
          // Unsupported
        }
      }),
      forcedTheme,
      themes: enableSystem
        ? Array.isArray(themes[0])
          ? [...(themes as string[][]), ["system"]]
          : [...(themes as string[]), "system"]
        : themes,
      systemTheme: (enableSystem ? resolvedThemeStore.value : undefined) as
        | "light"
        | "dark"
        | undefined,
    });

    // changes system theme based on user's system theme
    useOnWindow(
      "load",
      $((event) => {
        console.log("load event use on window")
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
          const resolved = getSystemTheme(e);
          resolvedThemeStore.setResolvedTheme(resolved);

          if (themeSig.value === "system" && enableSystem && !forcedTheme) {
            applyTheme("system");
          }
          if (resolved === "light" || resolved === "dark") {
            document.documentElement.style.colorScheme = resolved;
            applyTheme(resolved);
            localStorage.setItem(storageKey, resolved);
          }
        };

        media.addEventListener("change", handleMediaQuery);
      })
    );


    // localStorage event handling
    useOnWindow(
      "storage",
      $((e) => {
        const handleStorage = (e: StorageEvent) => {
          if (e.key !== storageKey) {
            return;
          }

          // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
          const theme = e.newValue || defaultTheme;
          themeStore.setTheme(theme);
        };
        handleStorage(e);
      })
    );


    // Whenever theme or forcedTheme changes, apply it
    useTask$(({ track }) => {
      track(() => themeSig.value || forcedTheme);

      if (themeSig.value !== "system") {
        resolvedThemeStore.setResolvedTheme(themeSig.value as string);
      }

      applyTheme(forcedTheme ?? themeSig.value);
    });

    useContextProvider(ThemeContext, themeStore);

    return (
      <Fragment>
        <ThemeScript
          {...{
            forcedTheme,
            disableTransitionOnChange,
            enableSystem,
            enableColorScheme,
            storageKey,
            themes,
            defaultTheme,
            attribute,
            value,
            attrs,
            nonce,
          }}
        />
        <Slot />
      </Fragment>
    );
  }
);
