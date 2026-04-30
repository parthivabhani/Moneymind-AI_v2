import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/LOGO.png" alt="MoneyMind AI Logo" className="h-9 w-auto" />
              <span className="text-xl font-semibold text-foreground">MoneyMind AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered financial insights for smarter decisions. Making financial analysis accessible to everyone.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/recommendations" className="hover:text-primary transition-colors">Recommendations</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Use Cases</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Disclaimer</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="rounded-lg bg-muted/50 p-4 mb-6">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Disclaimer:</strong> Financial insights provided by MoneyMind AI are recommendations based on data analysis and should not be considered as guaranteed financial advice. All data used is synthetic or publicly available. AI assists decision-making but does not replace professional financial advisors. Past performance does not guarantee future results.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 MoneyMind AI. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with transparency and trust in mind.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
