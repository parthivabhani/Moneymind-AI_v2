import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { 
  BarChart3, 
  Lightbulb, 
  Cpu, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Recommendations", path: "/recommendations", icon: Lightbulb },
  { name: "Features", path: "/features", icon: Cpu },
];

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/LOGO.png" alt="MoneyMind AI Logo" className="h-9 w-auto" />
          <span className="text-xl font-semibold text-foreground">MoneyMind AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button and Dark Mode Toggle */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <DarkModeToggle />
          <Button asChild variant="hero" size="default">
            <Link to="/dashboard?mode=demo">Try Demo</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.icon && <link.icon className="h-5 w-5" />}
                {link.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <DarkModeToggle />
              </div>
              <Button asChild variant="hero" className="w-full">
                <Link to="/dashboard?mode=demo" onClick={() => setMobileMenuOpen(false)}>
                  Try Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
