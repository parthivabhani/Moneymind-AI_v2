import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  TrendingDown,
  PiggyBank,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Brain,
  DollarSign,
  BarChart3,
  Clock,
  Download
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useRecommendationsData } from "@/hooks/useApi";
import { useDashboardData } from "@/hooks/useApi";
import { pdfExportService } from "@/lib/pdfExport";
import { toast } from "sonner";

const categoryIcons = {
  cost_reduction: TrendingDown,
  revenue_growth: BarChart3,
  cash_flow: DollarSign,
  risk_management: AlertCircle,
};

const categoryLabels = {
  cost_reduction: "Cost Optimization",
  revenue_growth: "Revenue Growth",
  cash_flow: "Cash Flow",
  risk_management: "Risk Management",
};



const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20"
};

const priorityLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Opportunity"
};

export default function Recommendations() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'user';
  const { data: apiRecommendations, isLoading, error } = useRecommendationsData(mode);
  const { data: dashboardData } = useDashboardData(mode);

  const recommendationList = Array.isArray(apiRecommendations) ? apiRecommendations : [];

  const handlePDFExport = async () => {
    const loadingToastId = toast.loading('Generating recommendations PDF...');
    
    try {
      await pdfExportService.exportRecommendations(
        recommendationList,
        `recommendations-${new Date().toISOString().split('T')[0]}.pdf`
      );

      toast.dismiss();
      toast.success('Recommendations PDF generated successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.dismiss();
      toast.error('Failed to generate recommendations PDF');
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

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading personalized recommendations...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Recommendations</h1>
            <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : "An unknown error occurred"}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const highPriorityCount = recommendationList.filter((r: any) => r.priority === 'high').length;
  const mediumPriorityCount = recommendationList.filter((r: any) => r.priority === 'medium').length;
  const lowPriorityCount = recommendationList.filter((r: any) => r.priority === 'low').length;

  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  AI-Powered
                </Badge>
                <span className="text-sm text-muted-foreground">Updated based on latest data</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePDFExport}
                  disabled={recommendationList.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Recommendations PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={handleComprehensiveExport}
                  disabled={!dashboardData?.hasData || recommendationList.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Full Report
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Personalized Recommendations</h1>
            <p className="text-muted-foreground mt-1">
              Actionable insights tailored to your financial situation, with clear reasoning and expected outcomes.
            </p>
          </div>

          {/* Summary Card */}
          <Card className="shadow-card mb-8 border-primary/20 bg-gradient-to-r from-accent/50 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">AI Analysis Summary</h3>
                  <p className="text-muted-foreground mb-4">
                    Based on your financial data, we've identified {recommendationList.length} actionable recommendations. Implementing the high-priority items could 
                    strengthen your overall financial position and efficiency.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">{highPriorityCount} High Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-muted-foreground">{mediumPriorityCount} Medium Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{lowPriorityCount} Opportunity</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-6">
            {recommendationList.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border shadow-sm">
                <Brain className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground">Upload your financial data on the dashboard to generate AI insights.</p>
              </div>
            ) : (
              recommendationList.map((rec: any, index: number) => {
                const IconComponent = categoryIcons[rec.category as keyof typeof categoryIcons] || Lightbulb;
                return (
                  <Card key={rec.id || index} className="shadow-card overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[rec.category as keyof typeof categoryLabels] || "Insight"}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={priorityColors[rec.priority as keyof typeof priorityColors]}
                              >
                                {priorityLabels[rec.priority as keyof typeof priorityLabels]}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl font-semibold">{rec.title}</CardTitle>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Description */}
                      <p className="text-muted-foreground">{rec.description}</p>
    
                      {/* Why Section */}
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground text-sm">Why This Recommendation</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                      </div>
    
                      {/* Impact */}
                      {rec.impact && (
                        <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <span className="font-medium text-foreground text-sm">Expected Impact</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {typeof rec.impact === 'string' ? rec.impact : (
                                <>
                                  {rec.impact.timeframe && `Timeframe: ${rec.impact.timeframe}`}
                                  {rec.impact.timeframe && rec.impact.savings && ' | '}
                                  {rec.impact.savings && `Estimated impact: $${rec.impact.savings.toLocaleString()}`}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
    
                      {/* Action Steps */}
                      {rec.actionItems && rec.actionItems.length > 0 && (
                        <div>
                          <span className="font-medium text-foreground text-sm">Suggested Actions</span>
                          <ul className="mt-3 space-y-2">
                            {rec.actionItems.map((action: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-semibold text-foreground mb-2">Important Notice</h4>
            <p className="text-sm text-muted-foreground">
              These recommendations are generated by AI analysis and should be considered as suggestions, not guaranteed financial advice. 
              Results may vary based on implementation and market conditions. We recommend consulting with a qualified financial advisor 
              before making significant financial decisions. All impact estimates are projections based on historical data patterns.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/dashboard">
                View Full Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
