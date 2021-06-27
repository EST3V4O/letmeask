import { createContext, ReactNode } from "react";
import { useLocalState } from "../hooks/useLocalState";

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

type ThemeContextProviderProps = {
  children: ReactNode;
}

export const ThemeContext = createContext({} as ThemeContextType)

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [ theme, setTheme ] = useLocalState('theme', 'light')

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}