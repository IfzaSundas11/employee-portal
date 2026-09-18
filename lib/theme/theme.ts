export type Theme = "Light" | "Dark" | "System";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "Dark") {
    root.classList.add("dark");
  } else if (theme === "Light") {
    root.classList.remove("dark");
  } else {
    // System
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }

  localStorage.setItem("theme", theme);
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "Light";
  return (localStorage.getItem("theme") as Theme) || "Light";
}