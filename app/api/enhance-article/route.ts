import { createPerplexity } from "@ai-sdk/perplexity";
import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});

type EnhanceRequest = {
  title: string;
  description: string | null;
  source: string | null;
};

const enhancedArticleSchema = z.object({
  summary: z.string(),
  keyTakeaways: z.array(z.string().min(1)).min(2).max(5),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        paragraphs: z.array(z.string().min(1)).min(1),
      })
    )
    .min(2),
  sources: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        url: z.string().url(),
      })
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  const body = (await request.json()) as EnhanceRequest;
  const { title, description, source } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: "Perplexity API key not configured" },
      { status: 500 }
    );
  }

  const systemPrompt = `You are an elite crypto research analyst writing for a premium audience. Create a polished briefing that feels like a high-end market intelligence report.

Title: ${title}
${description ? `Incoming summary: ${description}` : ""}
${source ? `Original outlet: ${source}` : ""}

Instructions:
- Produce structured JSON that matches the provided schema.
- Craft a succinct summary paragraph.
- Provide 3-4 bullet key takeaways written in complete sentences.
- Create 2-4 sections with thoughtful headings and 1-3 paragraphs each.
- Weave inline citation markers of the form [[SOURCE_ID]] into paragraphs where relevant.
- Each SOURCE_ID must match one of the IDs returned in the sources array.
- Curate 3-5 credible sources with human-friendly titles and working URLs.
- Avoid financial advice; focus on context, implications, and sentiment.
- Use premium tone—confident, insightful, and concise.`;

  try {
    const { object } = await generateObject({
      model: perplexity("sonar"),
      schema: enhancedArticleSchema,
      prompt: systemPrompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Failed to enhance article", error);
    return NextResponse.json(
      { error: "Unable to enhance article at this time." },
      { status: 500 }
    );
  }
}
