import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const navItems = [
  { to: "/", label: "Shop" },
  { to: "/sell", label: "Sell" },
  { to: "/inbox", label: "Inbox" },
  { to: "/profile", label: "Profile" },
] as const

export function HeaderNav() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight">Local Scraps</h1>

        <nav aria-label="Primary" className="justify-self-center">
          <ul className="flex items-center gap-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === "/"}>
                  {({ isActive }) => (
                    <Button variant={isActive ? "secondary" : "ghost"} className="text-sm font-medium">
                      {item.label}
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="justify-self-end">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}