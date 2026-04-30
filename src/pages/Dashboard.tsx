import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Clock,
  Upload,
  BarChart3,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { useDashboardData } from "@/hooks/useApi";
import { useRecommendationsData } from "@/hooks/useApi";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { pdfExportService } from "@/lib/pdfExport";

const iconMap = {
  DollarSign,
  TrendingDown,
  TrendingUp,
  ArrowUpRight
};

export default function Dashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'user';
  const { data: dashboardData, isLoading, error, refetch } = useDashboardData(mode);
  const { data: apiRecommendations } = useRecommendationsData(mode);
  const recommendationList = Array.isArray(apiRecommendations) ? apiRecommendations : [];

  // Show upload modal if coming from landing page with upload=true
  useEffect(() => {
    if (searchParams.get('upload') === 'true') {
      setShowUpload(true);
    }
  }, [searchParams]);

  const handleUploadSuccess = (data: any) => {
    toast.success('Financial data uploaded successfully!');
    setShowUpload(false);
    refetch();
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
  };

  const handlePDFExport = async () => {
    const loadingToastId = toast.loading('Generating PDF report...');

    try {
      const elementIds = [
        'metric-cards',
        'income-expenses-chart',
        'cash-flow-chart',
        'expense-categories',
        'forecast-section',
        'risk-indicators'
      ];

      await pdfExportService.exportDashboard(elementIds, {
        filename: `financial-report-${new Date().toISOString().split('T')[0]}.pdf`,
        title: 'Clarity Finance - Financial Analysis Report',
        dateRange: new Date().toLocaleDateString()
      });

      toast.dismiss();
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF report');
    }
  };

  const handleComprehensiveExport = async () => {
    const loadingToastId = toast.loading('Generating comprehensive report...');

    try {
      await pdfExportService.exportComprehensiveReport(
        dashboardData,
        recommendationList,
        {
          filename: `comprehensive-report-${new Date().toISOString().split('T')[0]}.pdf`,
          title: 'Clarity Finance - Comprehensive Financial Report',
          dateRange: new Date().toLocaleDateString()
        }
      );

      // Dismiss loading toast with delay and show success
      setTimeout(() => {
        toast.dismiss(loadingToastId);
        toast.success('Comprehensive report generated successfully!');
      }, 100);
    } catch (error) {
      console.error('Comprehensive export error:', error);
      // Dismiss loading toast with delay and show error
      setTimeout(() => {
        toast.dismiss(loadingToastId);
        toast.error('Failed to generate comprehensive report');
      }, 100);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading || !dashboardData) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { metricCards, chartData, expenseCategories, forecast, riskIndicators, executiveSummary } = dashboardData;

  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  Live Data
                </Badge>
                <span className="text-sm text-muted-foreground">AI-powered analysis</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUpload(!showUpload)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePDFExport}
                  disabled={!dashboardData?.hasData}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Dashboard PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={handleComprehensiveExport}
                  disabled={!dashboardData?.hasData}
                >
                  <Download className="mr-2 h-4 w-4" />
                  AI Insights' Report
                </Button>
                <Button onClick={() => refetch()}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of your financial health and performance.
            </p>
          </div>

          {/* File Upload Modal */}
          {showUpload && (
            <div className="mb-8">
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
          )}

          {/* Demo Data Banner */}
          {dashboardData.isDemoData && (
            <div className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded-lg mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">You are viewing Demo Data</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => {
                setShowUpload(true);
                window.history.replaceState(null, '', '/dashboard?mode=user');
              }}>
                Upload Your Own Data
              </Button>
            </div>
          )}

          {!dashboardData.hasData ? (
            <div className="text-center py-20 bg-card rounded-lg border border-border shadow-sm">
              <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Financial Data Uploaded</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start by uploading your financial transactions CSV file to unlock AI-powered insights, cash flow forecasts, and instant categorization.
              </p>
              <Button onClick={() => setShowUpload(true)} size="lg">
                <Upload className="mr-2 h-5 w-5" />
                Upload CSV File
              </Button>
            </div>
          ) : (
            <>
              {/* AI Executive Summary Panel */}
              {executiveSummary && (
                <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-r-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-6 w-6 text-primary animate-pulse" />
                    <h2 className="text-xl font-bold text-foreground">AI Executive Briefing</h2>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {executiveSummary}
                  </p>
                </div>
              )}

              {/* Metric Cards */}
              <div id="metric-cards" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {metricCards.map((metric, index) => {
                  const IconComponent = iconMap[metric.icon as keyof typeof iconMap];
                  return (
                    <Card key={index} className="shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{metric.title}</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {metric.trend === "up" ? (
                                <ArrowUpRight className="h-4 w-4 text-success" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-destructive" />
                              )}
                              <span className={metric.trend === "up" ? "text-success text-sm" : "text-destructive text-sm"}>
                                {metric.change}
                              </span>
                              <span className="text-muted-foreground text-sm">{metric.description}</span>
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                            {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-2 mb-8">
                {/* Income vs Expenses */}
                <Card id="income-expenses-chart" className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                          <XAxis dataKey="month" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }} />
                          <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(0, 0%, 100%)",
                              border: "1px solid hsl(214, 32%, 91%)",
                              borderRadius: "8px"
                            }}
                          />
                          <Legend />
                          <Bar dataKey="income" name="Income" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" name="Expenses" fill="hsl(173, 58%, 70%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">AI Insight:</span> Your latest month shows strong performance with positive cash flow. Keep monitoring expense trends.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Cash Flow Trend */}
                <Card id="cash-flow-chart" className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Monthly Cash Flow Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                          <XAxis dataKey="month" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }} />
                          <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(0, 0%, 100%)",
                              border: "1px solid hsl(214, 32%, 91%)",
                              borderRadius: "8px"
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="cashFlow"
                            name="Cash Flow"
                            stroke="hsl(173, 58%, 39%)"
                            fill="hsl(173, 58%, 39%)"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">AI Insight:</span> Cash flow patterns show consistency. Consider building reserves during high-flow months.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Second Row */}
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                {/* Expense Breakdown */}
                <Card id="expense-categories" className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Expense Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseCategories}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {expenseCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {expenseCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            <span className="text-muted-foreground">{category.name}</span>
                          </div>
                          <span className="font-medium text-foreground">{category.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cash Flow Forecast */}
                <Card id="forecast-section" className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Cash Flow Forecast</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        90-day
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {forecast.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.type === "actual" ? "bg-primary" : "bg-primary/50"}`} />
                            <span className="text-sm text-foreground">{item.period}</span>
                          </div>
                          <span className={`font-semibold ${item.cashFlow >= 0 ? "text-success" : "text-destructive"}`}>
                            ${item.cashFlow.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">AI Forecast:</span> Projected positive cash flow trend continues. Monitor for seasonal variations.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Indicators */}
                <Card id="risk-indicators" className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Risk Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {riskIndicators.map((risk, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {risk.status === "warning" || risk.status === "danger" ? (
                                <AlertTriangle className="h-4 w-4 text-warning" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-success" />
                              )}
                              <span className="font-medium text-foreground text-sm">{risk.title}</span>
                            </div>
                            <Badge
                              variant={risk.status === "danger" ? "destructive" : risk.status === "warning" ? "secondary" : "default"}
                              className={risk.status === "success" ? "bg-success hover:bg-success/90" : ""}
                            >
                              {risk.trend}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{risk.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
