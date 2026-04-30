import Groq from 'groq-sdk';
import { FinancialTransaction } from './csvParser';

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  return apiKey ? new Groq({ apiKey }) : null;
}

export const isAiEnabled = () => !!process.env.GROQ_API_KEY;

export async function batchCategorizeTransactionsLLM(
  transactions: FinancialTransaction[]
): Promise<FinancialTransaction[]> {
  const groq = getGroqClient();
  if (!groq || transactions.length === 0) return transactions;

  console.log(`[AI] Batch categorizing ${transactions.length} transactions via Groq LLM`);
  
  // Exclude already categorized ones
  const toCategorize = transactions.filter(t => !t.category).map((t, index) => ({
    id: index.toString(),
    description: t.description,
    amount: t.amount,
    type: t.type
  }));

  if (toCategorize.length === 0) return transactions;

  const prompt = `You are an automated financial categorization engine. 
Use EXACTLY ONE of these categories: 'Sales', 'Operations', 'Payroll', 'Marketing', 'Technology', 'Banking', 'Insurance', 'Travel', 'Food & Dining', 'Other'.
Return JUST a valid JSON object mapping the transaction "id" to the Category string. Do NOT output any reasoning or text outside the JSON object.
Data:
${JSON.stringify(toCategorize)}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      response_format: { type: 'json_object' }
    });

    const output = completion.choices[0]?.message?.content || '{}';
    const categoryMap: Record<string, string> = JSON.parse(output);

    let mapIndex = 0;
    return transactions.map(t => {
      if (!t.category) {
        const aiCategory = categoryMap[mapIndex.toString()];
        mapIndex++;
        return { ...t, category: aiCategory };
      }
      return t;
    });
  } catch (error) {
    console.error("[AI] Groq categorization error, falling back to heuristics:", error);
    return transactions;
  }
}

export async function generateExecutiveSummaryLLM(
  metricCards: any[],
  riskIndicators: any[]
): Promise<string> {
  const groq = getGroqClient();
  if (!groq) return "Add your GROQ_API_KEY to .env to unlock AI-powered executive insights.";

  console.log("[AI] Generating Executive Summary via Groq LLM");
  
  try {
    const prompt = `You are a CFO AI Assistant analyzing business health.
Write exactly ONE insightful, actionable paragraph (max 3 sentences) explaining the business focus. Base it on these metrics and flags. Do not use markdown.
Metrics: ${JSON.stringify(metricCards)}
Risks: ${JSON.stringify(riskIndicators)}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("[AI] Groq summary error:", error);
    return "AI insights temporarily unavailable. There was an error communicating with the Groq API.";
  }
}
