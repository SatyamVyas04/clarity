import { type NextRequest, NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import {
  COINS_PER_CORRECT,
  MAX_COINS_PER_QUIZ,
  QUIZ_QUESTION_COUNT,
} from "@/lib/quiz";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing quiz identifier" },
      { status: 400 }
    );
  }

  try {
    await ensureSchema();
  } catch (schemaError) {
    console.error("Failed to ensure schema", schemaError);
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 500 }
    );
  }

  try {
    const articleRows = await sql`
      SELECT
        a.slug,
        a.title,
        a.description,
        a.image_url,
        a.source_name,
        a.source_link,
        e.quiz_call_to_action
      FROM articles a
      LEFT JOIN article_enhancements e ON e.slug = a.slug
      WHERE a.slug = ${slug}
      LIMIT 1;
    `;

    if (articleRows.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const [article] = articleRows;

    const questionRows = await sql`
      SELECT
        id,
        prompt,
        option_a,
        option_b,
        option_c,
        option_d
      FROM quiz_questions
      WHERE article_slug = ${slug}
      ORDER BY id ASC;
    `;

    if (questionRows.length === 0) {
      return NextResponse.json(
        { error: "Quiz questions unavailable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      article: {
        slug: article.slug as string,
        title: article.title as string,
        description: article.description as string | null,
        imageUrl: article.image_url as string | null,
        sourceName: article.source_name as string | null,
        sourceLink: article.source_link as string | null,
        callToAction: (article.quiz_call_to_action as string) || undefined,
      },
      quiz: {
        questionCount: QUIZ_QUESTION_COUNT,
        rewardPerQuestion: COINS_PER_CORRECT,
        maxReward: MAX_COINS_PER_QUIZ,
      },
      questions: questionRows.map((row) => ({
        id: Number(row.id),
        prompt: row.prompt as string,
        options: {
          A: row.option_a as string,
          B: row.option_b as string,
          C: row.option_c as string,
          D: row.option_d as string,
        },
      })),
    });
  } catch (error) {
    console.error("Failed to fetch quiz", error);
    return NextResponse.json({ error: "Unable to load quiz" }, { status: 500 });
  }
}
