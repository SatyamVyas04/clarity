import { createPerplexity } from "@ai-sdk/perplexity";
import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureSchema, sql } from "@/lib/db";

const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});

type EnhanceRequest = {
  title: string;
  description: string | null;
  source: string | null;
  slug: string;
  imageUrl: string | null;
  sourceLink: string | null;
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
  quiz: z.object({
    callToAction: z.string().min(1),
    questions: z
      .array(
        z.object({
          prompt: z.string().min(1),
          options: z.object({
            A: z.string().min(1),
            B: z.string().min(1),
            C: z.string().min(1),
            D: z.string().min(1),
          }),
          correctOption: z.enum(["A", "B", "C", "D"]),
          explanation: z.string().optional(),
        })
      )
      .length(5),
  }),
});

export async function POST(request: NextRequest) {
  const body = (await request.json()) as EnhanceRequest;
  const { title, description, source, slug, imageUrl, sourceLink } = body;

  if (!(title && slug)) {
    return NextResponse.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: "Perplexity API key not configured" },
      { status: 500 }
    );
  }

  try {
    await ensureSchema();
  } catch (schemaError) {
    console.error("Failed to ensure database schema", schemaError);
    return NextResponse.json(
      { error: "Database setup failed" },
      { status: 500 }
    );
  }

  try {
    const existingEnhancement = await sql`
      SELECT
        e.summary,
        e.key_takeaways AS key_takeaways,
        e.sections,
        e.sources,
        e.quiz_call_to_action,
        q.id,
        q.prompt,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.explanation
      FROM article_enhancements e
      JOIN articles a ON a.slug = e.slug
      LEFT JOIN quiz_questions q ON q.article_slug = a.slug
      WHERE a.slug = ${slug}
      ORDER BY q.id ASC
    `;

    if (existingEnhancement.length > 0) {
      const [firstRow] = existingEnhancement;
      const groupedQuestions = existingEnhancement
        .filter((row) => row.id !== null)
        .map((row) => ({
          prompt: row.prompt as string,
          options: {
            A: row.option_a as string,
            B: row.option_b as string,
            C: row.option_c as string,
            D: row.option_d as string,
          },
          correctOption: row.correct_option as "A" | "B" | "C" | "D",
          explanation: (row.explanation as string | null) ?? undefined,
        }));

      if (groupedQuestions.length === 5) {
        const parseJson = <T>(value: unknown): T => {
          if (typeof value === "string") {
            try {
              return JSON.parse(value) as T;
            } catch {
              return value as T;
            }
          }
          return value as T;
        };

        return NextResponse.json({
          summary: firstRow.summary as string,
          keyTakeaways: parseJson<string[]>(firstRow.key_takeaways),
          sections: parseJson<Array<{ heading: string; paragraphs: string[] }>>(
            firstRow.sections
          ),
          sources: parseJson<Array<{ id: string; title: string; url: string }>>(
            firstRow.sources
          ),
          quiz: {
            callToAction:
              (firstRow.quiz_call_to_action as string) ||
              "Earn coins by tackling this rapid-fire clarity checkpoint.",
            questions: groupedQuestions,
          },
        });
      }
    }
  } catch (lookupError) {
    console.error("Failed to load cached enhancement", lookupError);
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
- Add a quiz section with exactly 5 multiple-choice questions about critical facts from the article.
- Each question must provide options with labels A, B, C, and D and specify the correctOption letter.
- Keep explanations under 40 words and only include them when needed for clarity.
- Use premium tone—confident, insightful, and concise.`;

  try {
    const { object } = await generateObject({
      model: perplexity("sonar"),
      schema: enhancedArticleSchema,
      prompt: systemPrompt,
    });
    await sql`
      INSERT INTO articles (slug, title, description, image_url, source_name, source_link, updated_at)
      VALUES (${slug}, ${title}, ${description}, ${imageUrl}, ${source}, ${sourceLink}, NOW())
      ON CONFLICT (slug) DO UPDATE
      SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        source_name = EXCLUDED.source_name,
        source_link = EXCLUDED.source_link,
        updated_at = NOW();
    `;

    await sql`
      INSERT INTO article_enhancements (slug, summary, key_takeaways, sections, sources, quiz_call_to_action, generated_at)
      VALUES (
        ${slug},
        ${object.summary},
        ${JSON.stringify(object.keyTakeaways)}::jsonb,
        ${JSON.stringify(object.sections)}::jsonb,
        ${JSON.stringify(object.sources)}::jsonb,
        ${object.quiz.callToAction},
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE
      SET
        summary = EXCLUDED.summary,
        key_takeaways = EXCLUDED.key_takeaways,
        sections = EXCLUDED.sections,
        sources = EXCLUDED.sources,
        quiz_call_to_action = EXCLUDED.quiz_call_to_action,
        generated_at = NOW();
    `;

    await sql`
      DELETE FROM quiz_questions
      WHERE article_slug = ${slug};
    `;

    for (const question of object.quiz.questions) {
      await sql`
        INSERT INTO quiz_questions (
          article_slug,
          prompt,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          explanation
        )
        VALUES (
          ${slug},
          ${question.prompt},
          ${question.options.A},
          ${question.options.B},
          ${question.options.C},
          ${question.options.D},
          ${question.correctOption},
          ${question.explanation ?? null}
        );
      `;
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error("Failed to enhance article", error);
    return NextResponse.json(
      { error: "Unable to enhance article at this time." },
      { status: 500 }
    );
  }
}
