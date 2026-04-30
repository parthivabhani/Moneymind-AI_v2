import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Brain,
  LineChart,
  Shield,
  Zap,
  Target,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  Building2,
  ArrowRight,
  CheckCircle,
  Cloud,
  Lock,
  Layers,
  Database
} from "lucide-react";

const aiFeatures = [
  {
    icon: LineChart,
    title: "Cash Flow Forecasting",
    description: "AI-powered predictions for 30, 60, and 90 days ahead based on historical patterns and seasonal trends.",
    highlight: "30/60/90 Day Forecasts"
  },
  {
    icon: Brain,
    title: "Explainable AI Logic",
    description: "Every recommendation includes clear reasoning. Understand not just what to do, but why it matters.",
    highlight: "Transparent Insights"
  },
  {
    icon: FileText,
    title: "Smart Expense Categorization",
    description: "NLP-powered automatic categorization of expenses with pattern recognition and anomaly detection.",
    highlight: "NLP-Powered"
  },
  {
    icon: AlertTriangle,
    title: "Anomaly & Risk Detection",
    description: "Early warning system for unusual patterns, potential fraud indicators, and financial health risks.",
    highlight: "Real-time Alerts"
  },
  {
    icon: Target,
    title: "Goal-Based Planning",
    description: "Set financial goals (savings, growth, stability) and receive tailored recommendations to achieve them.",
    highlight: "Personalized Goals"
  },
  {
    icon: Building2,
    title: "SME-Specific Metrics",
    description: "Working capital analysis, profit per product/service, and business-specific financial health indicators.",
    highlight: "Business Intelligence"
  }
];

const techStack = [
  {
    icon: Database,
    title: "Data Ingestion",
    description: "Secure CSV upload or synthetic dataset generation. No real banking data required for demo."
  },
  {
    icon: Brain,
    title: "AI/ML Models",
    description: "Trend detection, time-series forecasting, and recommendation engines powered by modern ML."
  },
  {
    icon: Cloud,
    title: "Scalable Architecture",
    description: "API-based, cloud-ready infrastructure designed for performance and reliability."
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    description: "Data encryption, secure processing, and emphasis on transparency in all AI decisions."
  }
];

const useCases = [
  {
    icon: Users,
    title: "Personal Finance",
    description: "Track income, expenses, and savings. Get personalized recommendations to improve financial health.",
    features: ["Budget optimization", "Savings goals", "Expense insights"]
  },
  {
    icon: Building2,
    title: "SME Financial Health",
    description: "Monitor business cash flow, profitability, and working capital with actionable insights.",
    features: ["Cash flow forecasting", "Expense analysis", "Growth metrics"]
  },
  {
    icon: Zap,
    title: "Fintech Integration",
    description: "API access for fintech platforms to embed AI-powered financial insights into their products.",
    features: ["RESTful API", "Webhook support", "White-label options"]
  }
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Basic financial insights for individuals",
    features: ["Basic expense tracking", "Monthly summary", "3 recommendations/month", "Sample data only"]
  },
  {
    name: "Pro",
    price: "$29",
    description: "Advanced insights for serious users",
    features: ["Full AI analysis", "Unlimited recommendations", "30/60/90 day forecasts", "CSV data upload", "Priority support"],
    highlighted: true
  },
  {
    name: "Business",
    price: "$99",
    description: "Complete solution for SMEs",
    features: ["Everything in Pro", "Multi-user access", "SME-specific metrics", "API access", "Custom integrations"]
  }
];

export default function Features() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              Innovation & Technology
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
              AI-Powered Financial Intelligence
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the technology and features that make MoneyMind AI your trusted financial analysis partner.
            </p>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">AI & Innovation Features</h2>
            <p className="text-muted-foreground max-w-2xl">
              Advanced capabilities designed to make financial analysis accessible, understandable, and actionable.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="shadow-card group hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">{feature.highlight}</Badge>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Technology & Architecture</h2>
            <p className="text-muted-foreground max-w-2xl">
              Built on modern, scalable infrastructure with transparency and explainability at its core.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-lg bg-card border border-border">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Data Privacy Commitment</h4>
                <p className="text-sm text-muted-foreground">
                  MoneyMind AI uses only synthetic or user-provided data. No real banking credentials are required. 
                  All AI decisions are explainable, and we're committed to transparency in how insights are generated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Use Cases & Applications</h2>
            <p className="text-muted-foreground max-w-2xl">
              From personal finance to enterprise solutions, MoneyMind AI adapts to your needs.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {useCases.map((useCase, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">
              Choose the plan that fits your needs. Start free and upgrade as you grow.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`shadow-card relative ${tier.highlighted ? "border-primary border-2 shadow-elevated" : ""}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={tier.highlighted ? "hero" : "outline"} 
                    className="w-full"
                    asChild
                  >
                    <Link to="/dashboard">
                      {tier.price === "$0" ? "Try Free" : "Get Started"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl mb-4">
              See It in Action
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Explore our interactive demo dashboard with sample data and experience AI-powered financial insights firsthand.
            </p>
            <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/dashboard">
                Launch Demo Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
