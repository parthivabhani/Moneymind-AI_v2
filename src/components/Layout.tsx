import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { InteractiveBackground } from "./InteractiveBackground";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <InteractiveBackground />
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
