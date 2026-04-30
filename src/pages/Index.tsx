import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { 
  ArrowRight, 
  Upload, 
  BarChart3, 
  Brain, 
  FileText,
  TrendingDown,
  AlertCircle,
  Users,
  Zap,
  Shield,
  LineChart,
  PieChart,
  Target,
  CheckCircle,
  Database,
  Lock,
  Activity
} from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Lack of Real-time Insights",
    description: "Financial data exists but extracting meaningful insights in real-time remains challenging for most users."
  },
  {
    icon: AlertCircle,
    title: "Poor Financial Understanding",
    description: "Income, expenses, and profitability are tracked but rarely understood in context of business health."
  },
  {
    icon: Users,
    title: "Limited Expert Access",
    description: "Professional financial advice is expensive and often inaccessible to individuals and small businesses."
  },
  {
    icon: FileText,
    title: "Generic Tools",
    description: "Most financial tools offer one-size-fits-all solutions without personalization to specific needs."
  }
];

const steps = [
  {
    number: "01",
    title: "Upload Your Data",
    description: "Import your financial data via CSV or use our sample dataset to explore the platform.",
    icon: Upload
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI analyzes income, expenses, cash flow patterns, and identifies trends automatically.",
    icon: Brain
  },
  {
    number: "03",
    title: "Get Insights",
    description: "Receive clear, explainable insights with risk indicators and opportunity highlights.",
    icon: LineChart
  },
  {
    number: "04",
    title: "Take Action",
    description: "View personalized recommendations with expected impact and clear reasoning.",
    icon: Target
  }
];

const features = [
  {
    icon: PieChart,
    title: "Expense Breakdown",
    description: "Automatic categorization of expenses with AI-powered insights."
  },
  {
    icon: LineChart,
    title: "Cash Flow Forecasting",
    description: "30, 60, and 90-day forecasts based on historical patterns."
  },
  {
    icon: Shield,
    title: "Risk Detection",
    description: "Early warning system for potential cash flow issues."
  },
  {
    icon: Zap,
    title: "Actionable Recommendations",
    description: "Clear, explainable suggestions to improve financial health."
  }
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md px-5 py-2 text-sm font-medium text-primary animate-fade-in shadow-[0_0_20px_rgba(var(--primary),0.2)]">
              <Zap className="h-4 w-4" />
              AI-Powered Financial Intelligence
            </div>
            
            <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl lg:text-8xl animate-fade-up">
              Insights for <br />
              <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                Smarter Decisions
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Understanding cash flow, profitability, and financial risks shouldn't require an expert. 
              Our AI analyzes your data and delivers clear, actionable insights you can trust.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="xl" className="relative group overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all hover:shadow-[0_0_60px_hsl(var(--primary)/0.6)] hover:-translate-y-1">
                <Link to="/dashboard?mode=user&upload=true">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Financial Data
                  </span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-border/50 bg-background/20 backdrop-blur-md hover:bg-background/40 hover:border-primary/50 transition-all hover:-translate-y-1">
                <Link to="/dashboard?mode=demo">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  View Demo Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Abstract Hero Graphic */}
          <div className="mx-auto mt-20 max-w-5xl animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative rounded-2xl border border-border/50 bg-background/30 backdrop-blur-xl shadow-2xl p-4 md:p-8 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <div className="flex items-center gap-2 mb-6 opacity-70">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 rounded-xl bg-card/40 border border-border/30 p-4 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="w-20 h-2 bg-muted rounded-full mb-2" />
                    <div className="w-32 h-6 bg-foreground/20 rounded-md" />
                  </div>
                </div>
                <div className="h-32 rounded-xl bg-card/40 border border-border/30 p-4 flex flex-col justify-between md:col-span-2 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-full h-24 opacity-30">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-primary fill-primary/10">
                      <path d="M0,100 L0,50 Q25,30 50,60 T100,20 L100,100 Z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center relative z-10">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-24 h-2 bg-muted rounded-full mb-2" />
                    <div className="w-40 h-8 bg-foreground/20 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <div className="border-y border-border/20 bg-background/10 backdrop-blur-md py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm font-medium text-muted-foreground opacity-80">
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              <span>Read-Only Access</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <span>100% Data Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <section className="py-24 relative">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
              The Challenge with Financial Data
            </h2>
            <p className="text-xl text-muted-foreground">
              Having financial data is one thing. Understanding what it means for your future is another.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl border border-border/30 bg-background/40 backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-background/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-110 transition-transform duration-500">
                    <problem.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{problem.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-secondary/10 backdrop-blur-[2px]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
              How MoneyMind AI Works
            </h2>
            <p className="text-xl text-muted-foreground">
              From data to insights in four simple steps. No financial expertise required.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="rounded-2xl border border-border/30 bg-background/50 backdrop-blur-lg p-8 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-5xl font-black text-foreground/5 group-hover:text-primary/10 transition-colors duration-300">{step.number}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 w-12 items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-24 relative">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
              What You'll Get
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful AI-driven tools designed for clarity and actionability.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group rounded-2xl border border-border/30 bg-background/40 backdrop-blur-xl p-8 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button asChild variant="outline" size="xl" className="rounded-full border-primary/30 bg-background/30 backdrop-blur-md hover:bg-primary/10 hover:border-primary">
              <Link to="/features" className="group">
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-lg" />
        {/* Decorative elements inside CTA */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl mb-6">
              Ready to See Your Financial Insights?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 leading-relaxed">
              Explore our demo dashboard with sample data and see how AI can transform your financial understanding instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-2xl hover:scale-105 transition-all duration-300 rounded-full px-8">
                <Link to="/dashboard?mode=demo">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Launch Demo Dashboard
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/90 font-medium">
              <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full backdrop-blur-md">
                <CheckCircle className="h-5 w-5" />
                No signup required
              </div>
              <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full backdrop-blur-md">
                <CheckCircle className="h-5 w-5" />
                Sample data included
              </div>
              <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full backdrop-blur-md">
                <CheckCircle className="h-5 w-5" />
                Fully interactive
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </Layout>
  );
}
