import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// next-themes type definition import can be tricky depending on the version.
// Using a simple wrapper since we pass standard next-themes props.
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
