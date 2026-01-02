import { type NextRequest, NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing article identifier" },
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
        a.created_at,
        e.summary,
        e.key_takeaways,
        e.sections,
        e.sources,
        e.quiz_call_to_action
      FROM articles a
      LEFT JOIN article_enhancements e ON e.slug = a.slug
      WHERE a.slug = ${slug}
      LIMIT 1;
    `;

    if (articleRows.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const [article] = articleRows;

    const parseJson = <T>(value: unknown): T | null => {
      if (value === null || value === undefined) {
        return null;
      }
      if (typeof value === "string") {
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      }
      return value as T;
    };

    const hasEnhancement = article.summary !== null;

    return NextResponse.json({
      article: {
        slug: article.slug as string,
        title: article.title as string,
        description: (article.description as string) ?? null,
        imageUrl: (article.image_url as string) ?? null,
        sourceName: (article.source_name as string) ?? null,
        sourceLink: (article.source_link as string) ?? null,
        createdAt: article.created_at as string,
      },
      enhancement: hasEnhancement
        ? {
            summary: article.summary as string,
            keyTakeaways: parseJson<string[]>(article.key_takeaways) ?? [],
            sections:
              parseJson<Array<{ heading: string; paragraphs: string[] }>>(
                article.sections
              ) ?? [],
            sources:
              parseJson<Array<{ id: string; title: string; url: string }>>(
                article.sources
              ) ?? [],
            quizCallToAction: (article.quiz_call_to_action as string) || null,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to fetch article", error);
    return NextResponse.json(
      { error: "Unable to load article" },
      { status: 500 }
    );
  }
}
